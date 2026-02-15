#!/usr/bin/env python3
"""
新年祝福语爬虫脚本

通过微信公众号搜索(搜狗) + 已知祝福语网站直接爬取春节祝福语素材，
按关系×风格×长度分类，输出结构化 JSON 供应用使用。

Usage:
    python scripts/scrape_blessings.py              # 完整爬取
    python scripts/scrape_blessings.py --resume      # 断点续爬
    python scripts/scrape_blessings.py --stats       # 查看已有数据覆盖率
    python scripts/scrape_blessings.py --dry-run     # 只显示搜索词不实际爬取
"""

import argparse
import difflib
import json
import random
import re
import time
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR / "output"
OUTPUT_FILE = OUTPUT_DIR / "blessings.json"
PROGRESS_FILE = OUTPUT_DIR / "scrape_progress.json"

RELATIONSHIPS = ["elder", "colleague", "leader", "friend", "partner", "customer"]
STYLES = ["formal", "casual", "funny", "literary", "brief"]
LENGTHS = ["short", "medium", "long"]

TARGET_PER_BUCKET = 10

# Chinese labels matching src/types.ts
REL_LABELS = {
    "elder": "长辈",
    "colleague": "同事",
    "leader": "领导",
    "friend": "朋友",
    "partner": "恋人",
    "customer": "客户",
}

STYLE_LABELS = {
    "formal": "正式",
    "casual": "轻松",
    "funny": "搞笑",
    "literary": "文艺",
    "brief": "简短",
}

# Synonyms for expanding search queries
REL_SYNONYMS = {
    "elder": ["长辈", "父母", "爸妈", "爷爷奶奶", "叔伯"],
    "colleague": ["同事", "同仁", "工作伙伴"],
    "leader": ["领导", "上级", "老板", "上司"],
    "friend": ["朋友", "好友", "闺蜜", "兄弟", "哥们"],
    "partner": ["恋人", "爱人", "老婆", "老公", "对象", "男朋友", "女朋友"],
    "customer": ["客户", "合作伙伴", "甲方", "贵公司"],
}

STYLE_SYNONYMS = {
    "formal": ["正式", "恭祝", "敬祝", "庄重", "典雅"],
    "casual": ["轻松", "日常", "随意", "口语化", "亲切"],
    "funny": ["搞笑", "幽默", "有趣", "沙雕", "段子"],
    "literary": ["文艺", "诗意", "古风", "唯美", "散文"],
    "brief": ["简短", "一句话", "简洁", "精简", "短句"],
}

# Extra search hints for hard-to-find long blessings
LONG_HINTS = ["长篇", "感人", "贺词", "致辞", "一封信"]

# Curated seed URLs per relationship (high-quality blessing sites)
# User-provided WeChat articles (added to all relationships for bulk classification)
WECHAT_SEED_URLS = [
    "https://mp.weixin.qq.com/s/TP4rcv1vHXy2AJgVMpHGyA",
    "https://mp.weixin.qq.com/s/36ynLsBhuq_G55AlutxCuQ",
    "https://mp.weixin.qq.com/s/5p5SlE7bUKhKnuYfbfbWNg",
    "https://mp.weixin.qq.com/s/OqcfiDEX44J4YtTwGs9QMA",
    "https://mp.weixin.qq.com/s/bREG9D3GCcozXx_8D6d-fw",
]

SEED_URLS = {
    "elder": [
        "https://www.ruiwen.com/zhufuyu/chunjie/",
        "https://www.yjbys.com/heci/3568093.html",
        "https://www.duanmeiwen.com/zhufuyu/4451508.html",
        "https://www.163.com/dy/article/JM3GSVVT0556BB8F.html",
        "https://m.thepaper.cn/newsDetail_forward_26329501",
    ],
    "colleague": [
        "https://www.ruiwen.com/zhufuyu/chunjie/",
        "https://fanwen.hao86.com/zhufuyu/235083.html",
        "https://www.duanmeiwen.com/zhufuyu/4451508.html",
        "https://www.163.com/dy/article/JM3GSVVT0556BB8F.html",
    ],
    "leader": [
        "https://www.ruiwen.com/zhufuyu/chunjie/",
        "https://www.163.com/dy/article/JM3GSVVT0556BB8F.html",
        "https://m.thepaper.cn/newsDetail_forward_26329501",
        "https://www.juzimi.com.cn/zhufuyu/chunjiezhufuyu/867587.html",
    ],
    "friend": [
        "https://www.ruiwen.com/zhufuyu/chunjie/",
        "https://www.duanmeiwen.com/zhufuyu/4451508.html",
        "https://www.163.com/dy/article/JM3GSVVT0556BB8F.html",
    ],
    "partner": [
        "https://www.ruiwen.com/zhufuyu/chunjie/",
        "https://www.yjbys.com/juzi/weimei/15317.html",
        "https://www.163.com/dy/article/JM3GSVVT0556BB8F.html",
    ],
    "customer": [
        "https://www.ruiwen.com/zhufuyu/chunjie/",
        "https://m.thepaper.cn/newsDetail_forward_26329501",
        "https://www.163.com/dy/article/JM3GSVVT0556BB8F.html",
        "https://news.sina.cn/2018-02-15/detail-ifyrrhct8366311.d.html",
    ],
}

# Length buckets (relaxed to minimize gap zone)
LENGTH_RANGES = {
    "short": (0, 50),
    "medium": (51, 240),
    "long": (240, 600),
}

# Blessing keyword detection
BLESSING_KEYWORDS = [
    "祝", "愿", "新春", "快乐", "福", "吉", "顺", "安康",
    "如意", "幸福", "美满", "恭", "贺", "大吉", "新年",
    "春节", "马年", "丙午", "拜年", "团圆", "红包",
    "万事", "平安", "健康", "发财", "兴旺",
]

# Style detection keywords (for classifying scraped text into styles)
STYLE_INDICATORS = {
    "formal": ["恭祝", "敬祝", "谨祝", "恭贺", "敬贺", "谨此", "惠存"],
    "casual": ["呀", "啦", "嘛", "哈", "吧", "嘿", "哟", "噢", "耶"],
    "funny": ["哈哈", "笑", "段子", "搞", "梗", "沙雕", "红包", "马上有钱",
              "马上有对象", "算了", "别问", "偷偷"],
    "literary": ["诗", "词", "韵", "岁月", "光阴", "山河", "烟火", "星辰",
                 "明月", "清风", "远方", "彼岸", "流年", "画卷"],
    "brief": [],  # Classified primarily by length (short texts)
}

# Relationship detection keywords
REL_INDICATORS = {
    "elder": ["长辈", "父母", "爸", "妈", "爷爷", "奶奶", "外公", "外婆",
              "叔", "伯", "姑", "姨", "健康长寿", "身体安康", "福寿"],
    "colleague": ["同事", "同仁", "工作", "合作", "并肩", "共事", "团队"],
    "leader": ["领导", "上级", "老板", "指导", "带领", "栽培", "提携"],
    "friend": ["朋友", "好友", "兄弟", "闺蜜", "哥们", "姐妹", "铁子",
               "友谊", "友情"],
    "partner": ["爱", "恋", "亲爱", "宝贝", "老婆", "老公", "甜蜜",
                "浪漫", "陪伴", "在一起", "牵手", "情人"],
    "customer": ["客户", "贵公司", "贵司", "合作", "商祺", "业务",
                 "合作伙伴", "携手", "共创", "共赢"],
}

# Patterns indicating non-blessing content to filter out
NOISE_PATTERNS = [
    re.compile(r"版权|©|copyright", re.IGNORECASE),
    re.compile(r"备案号|ICP|京公网"),
    re.compile(r"点击|下载|关注|扫码|二维码|微信公众号"),
    re.compile(r"广告|推广|赞助|sponsored", re.IGNORECASE),
    re.compile(r"导航|首页|上一页|下一页|返回"),
    re.compile(r"登录|注册|会员|VIP"),
    re.compile(r"http[s]?://\S+"),
    re.compile(r"原文链接|转载|来源[:：]"),
    re.compile(r"评论|回复|分享到"),
    re.compile(r"阅读全文|展开全部|查看更多"),
]

# User-Agent rotation pool
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]

# ---------------------------------------------------------------------------
# Utility functions
# ---------------------------------------------------------------------------


def count_chinese_chars(text: str) -> int:
    """Count Chinese characters in text."""
    return sum(1 for ch in text if "\u4e00" <= ch <= "\u9fff")


def normalize_text(text: str) -> str:
    """Normalize text for deduplication: strip whitespace, normalize unicode."""
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\s+", "", text)
    text = text.strip("。！!？?，,、；;：:""''\"'")
    return text


def classify_length(char_count: int) -> str | None:
    """Classify text into short/medium/long bucket, or None if in gap zone."""
    for length_id, (lo, hi) in LENGTH_RANGES.items():
        if lo <= char_count <= hi:
            return length_id
    return None


def has_blessing_keywords(text: str, min_count: int = 2) -> bool:
    """Check if text contains at least min_count blessing keywords."""
    found = sum(1 for kw in BLESSING_KEYWORDS if kw in text)
    return found >= min_count


def has_noise(text: str) -> bool:
    """Check if text contains noise patterns (ads, navigation, etc.)."""
    return any(pat.search(text) for pat in NOISE_PATTERNS)


def is_similar(text: str, existing: list[str], threshold: float = 0.85) -> bool:
    """Check if text is too similar to any existing text."""
    normalized = normalize_text(text)
    for ex in existing:
        ratio = difflib.SequenceMatcher(None, normalized, normalize_text(ex)).ratio()
        if ratio > threshold:
            return True
    return False


def detect_style(text: str) -> str | None:
    """Detect the style of a blessing text based on keyword indicators."""
    cc = count_chinese_chars(text)

    # Brief: very short text (<=36 chars) is a candidate for brief style
    if cc <= 36:
        return "brief"

    scores = {}
    for style, keywords in STYLE_INDICATORS.items():
        if style == "brief":
            continue
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            scores[style] = score

    if not scores:
        return None
    return max(scores, key=scores.get)


def detect_relationship(text: str) -> str | None:
    """Detect the target relationship of a blessing text."""
    scores = {}
    for rel, keywords in REL_INDICATORS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            scores[rel] = score

    if not scores:
        return None
    return max(scores, key=scores.get)


def random_delay(lo: float, hi: float):
    """Sleep for a random duration between lo and hi seconds."""
    time.sleep(random.uniform(lo, hi))


# ---------------------------------------------------------------------------
# HTTP session with anti-ban measures
# ---------------------------------------------------------------------------


def create_session() -> requests.Session:
    """Create a requests session with default headers."""
    session = requests.Session()
    session.headers.update({
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
    })
    return session


def rotate_ua(session: requests.Session):
    """Rotate User-Agent on the session."""
    session.headers["User-Agent"] = random.choice(USER_AGENTS)


def fetch_page(session: requests.Session, url: str, timeout: int = 15) -> str | None:
    """Fetch a page with encoding fallback. Returns HTML string or None."""
    rotate_ua(session)

    # Resolve Sogou WeChat redirect links to actual mp.weixin.qq.com URLs
    if "weixin.sogou.com/link" in url:
        url = _resolve_sogou_redirect(session, url)
        if url is None:
            return None

    try:
        resp = session.get(url, timeout=timeout, allow_redirects=True)
        resp.raise_for_status()

        # Encoding fallback chain: declared > apparent > gbk > gb2312
        if resp.encoding and resp.encoding.lower() not in ("iso-8859-1",):
            text = resp.text
        else:
            if resp.apparent_encoding:
                resp.encoding = resp.apparent_encoding
                text = resp.text
            else:
                for enc in ("utf-8", "gbk", "gb2312", "gb18030"):
                    try:
                        text = resp.content.decode(enc)
                        break
                    except (UnicodeDecodeError, LookupError):
                        continue
                else:
                    text = resp.content.decode("utf-8", errors="replace")
        return text
    except requests.RequestException as e:
        print(f"  [WARN] Failed to fetch {url}: {e}")
        return None


def _resolve_sogou_redirect(session: requests.Session, redirect_url: str) -> str | None:
    """Resolve a Sogou WeChat redirect link to the actual mp.weixin.qq.com URL.
    Sogou fragments the URL in JS like: url += 'https://mp.'; url += 'weixin.qq.c'; ...
    """
    try:
        resp = session.get(redirect_url, timeout=10, allow_redirects=True)
        if resp.status_code != 200:
            return None

        # Extract fragmented URL from JS: url += '...'; url += '...';
        fragments = re.findall(r"url\s*\+=\s*'([^']*)'", resp.text)
        if fragments:
            actual_url = "".join(fragments)
            if actual_url.startswith("http"):
                return actual_url

        # Fallback: look for direct mp.weixin URL in content
        match = re.search(r'(https?://mp\.weixin\.qq\.com/s[^\s"\'<>]+)', resp.text)
        if match:
            return match.group(1)

        return None
    except requests.RequestException:
        return None


# ---------------------------------------------------------------------------
# Search (WeChat/Sogou-based for public account articles)
# ---------------------------------------------------------------------------


def weixin_sogou_search_urls(session: requests.Session, query: str, pages: int = 3) -> list[str]:
    """Search WeChat articles via Sogou WeChat search. Returns article URLs."""
    urls = []
    for page in range(1, pages + 1):
        search_url = (
            f"https://weixin.sogou.com/weixin?"
            f"type=2&query={quote(query)}&page={page}"
        )

        # Retry up to 3 times with increasing backoff
        html = None
        for attempt in range(3):
            html = fetch_page(session, search_url)
            if html is None:
                break
            if "用户您好，您的访问过于频繁" in html or "antispider" in html:
                backoff = random.uniform(120, 300) * (attempt + 1)
                print(f"  [BLOCKED] Sogou anti-bot (attempt {attempt+1}/3), waiting {backoff:.0f}s...")
                time.sleep(backoff)
                html = None
                continue
            break  # Got valid response

        if html is None:
            continue

        soup = BeautifulSoup(html, "lxml")

        # Sogou WeChat results: <div class="txt-box"><h3><a href="/link?url=...">
        for a in soup.select("div.txt-box h3 a[href]"):
            href = a.get("href", "")
            if not href:
                continue
            # Resolve relative Sogou redirect links
            if href.startswith("/link?"):
                href = "https://weixin.sogou.com" + href
            if href.startswith("http"):
                urls.append(href)

        random_delay(10, 20)

    return urls


def sogou_search_urls(session: requests.Session, query: str, pages: int = 2) -> list[str]:
    """Search Sogou web as fallback engine."""
    urls = []
    for page in range(pages):
        search_url = f"https://www.sogou.com/web?query={quote(query)}&page={page+1}"

        html = fetch_page(session, search_url)
        if html is None:
            continue

        soup = BeautifulSoup(html, "lxml")

        for result in soup.select("div.vrwrap a[href], div.rb a[href], h3 a[href]"):
            href = result.get("href", "")
            if href.startswith("http") and "sogou.com" not in href:
                urls.append(href)

        random_delay(2, 4)

    return urls


# ---------------------------------------------------------------------------
# Search query generation
# ---------------------------------------------------------------------------


def build_queries(rel: str, style: str) -> list[str]:
    """Build search queries for a relationship x style combination."""
    rel_label = REL_LABELS[rel]
    style_label = STYLE_LABELS[style]

    rel_syns = random.sample(REL_SYNONYMS[rel], min(2, len(REL_SYNONYMS[rel])))
    style_syns = random.sample(STYLE_SYNONYMS[style], min(2, len(STYLE_SYNONYMS[style])))

    queries = [
        f"春节祝福语 {rel_label} {style_label} 大全",
        f"新年祝福 {rel_syns[0]} {style_syns[0]}",
    ]

    extra = random.choice(["精选", "最新", "经典", "大全", "集锦"])
    queries.append(f"新春 {rel_syns[-1]} {style_syns[-1]} 祝福语 {extra}")

    return queries


def build_long_queries(rel: str, style: str) -> list[str]:
    """Extra queries targeting long-form blessings."""
    rel_label = REL_LABELS[rel]
    style_label = STYLE_LABELS[style]
    hint = random.choice(LONG_HINTS)

    return [
        f"春节 {rel_label} {hint} 祝福语 {style_label}",
        f"新年 {rel_label} 长篇祝福 贺词",
    ]


# ---------------------------------------------------------------------------
# Content extraction
# ---------------------------------------------------------------------------


def extract_blessings_from_html(html: str) -> list[str]:
    """Extract blessing text blocks from an HTML page."""
    soup = BeautifulSoup(html, "lxml")

    # Remove unwanted tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    candidates = []
    seen = set()

    def _add(text: str):
        text = text.strip()
        if text and text not in seen and count_chinese_chars(text) >= 4:
            seen.add(text)
            candidates.append(text)

    # Strategy 1: List items (most blessing sites use <li> or <p> lists)
    for li in soup.find_all("li"):
        _add(li.get_text(strip=True))

    # Strategy 2: Paragraphs
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        # Some pages put multiple blessings in one <p> separated by numbers
        parts = re.split(r"[\d一二三四五六七八九十]+[、.．）)]\s*", text)
        for part in parts:
            _add(part)

    # Strategy 3: Content divs
    for div in soup.find_all("div", class_=re.compile(
            r"content|text|article|blessing|item|card|post|entry|body", re.I)):
        text = div.get_text(separator="\n", strip=True)
        for line in text.split("\n"):
            line = line.strip()
            # Strip number prefix
            cleaned = re.sub(r"^[\d一二三四五六七八九十]+[、.．）)\.]?\s*", "", line)
            _add(cleaned)

    # Strategy 4: Strong/b tags often wrap individual blessings
    for tag in soup.find_all(["strong", "b"]):
        _add(tag.get_text(strip=True))

    return candidates


def clean_blessing_text(text: str) -> str:
    """Clean a raw blessing text candidate."""
    # Remove number prefixes
    text = re.sub(r"^[\d一二三四五六七八九十]+[、.．）)]\s*", "", text)
    text = re.sub(r"^\s*[（(]\d+[)）]\s*", "", text)

    # Remove leading/trailing dashes
    text = text.strip()
    text = re.sub(r"^[—\-–]+\s*", "", text)
    text = re.sub(r"\s*[—\-–]+$", "", text)

    # Collapse whitespace
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def filter_blessing(text: str) -> bool:
    """Return True if text passes quality filters."""
    if not text:
        return False

    cc = count_chinese_chars(text)
    if cc < 6 or cc > 700:
        return False

    if not has_blessing_keywords(text, min_count=2):
        return False

    if has_noise(text):
        return False

    return True


# ---------------------------------------------------------------------------
# Main scraping logic
# ---------------------------------------------------------------------------


class BlessingScraper:
    def __init__(self, resume: bool = False):
        self.session = create_session()
        self.blessings: dict[str, dict[str, dict[str, list[dict]]]] = {}
        self.normalized_set: set[str] = set()
        self.progress: dict[str, bool] = {}
        self.resume = resume

        # Initialize structure
        for rel in RELATIONSHIPS:
            self.blessings[rel] = {}
            for style in STYLES:
                self.blessings[rel][style] = {}
                for length in LENGTHS:
                    self.blessings[rel][style][length] = []

        if resume:
            self._load_progress()

    def _load_progress(self):
        """Load progress and existing data for resume mode."""
        if PROGRESS_FILE.exists():
            with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                self.progress = json.load(f)
            print(f"Loaded progress: {sum(v for v in self.progress.values() if v)} combinations completed")

        if OUTPUT_FILE.exists():
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            if "blessings" in data:
                for rel in RELATIONSHIPS:
                    if rel not in data["blessings"]:
                        continue
                    for style in STYLES:
                        if style not in data["blessings"][rel]:
                            continue
                        for length in LENGTHS:
                            if length not in data["blessings"][rel][style]:
                                continue
                            items = data["blessings"][rel][style][length]
                            self.blessings[rel][style][length] = items
                            for item in items:
                                self.normalized_set.add(normalize_text(item["text"]))
            print(f"Loaded {len(self.normalized_set)} existing blessings")

    def _save_progress(self):
        """Save current progress to disk."""
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump(self.progress, f, ensure_ascii=False, indent=2)

    def _save_output(self):
        """Save blessings data to output JSON."""
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        stats = {}
        total = 0
        for rel in RELATIONSHIPS:
            stats[rel] = {}
            for style in STYLES:
                stats[rel][style] = {}
                for length in LENGTHS:
                    count = len(self.blessings[rel][style][length])
                    stats[rel][style][length] = count
                    total += count

        output = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_count": total,
            },
            "blessings": self.blessings,
            "stats": stats,
        }

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

        print(f"\nSaved {total} blessings to {OUTPUT_FILE}")

    def _add_blessing(self, text: str, rel: str, style: str, source_url: str) -> int:
        """Add a blessing, classifying by length. Returns 0 or 1."""
        text = clean_blessing_text(text)
        if not filter_blessing(text):
            return 0

        cc = count_chinese_chars(text)
        length_id = classify_length(cc)
        if length_id is None:
            return 0

        bucket = self.blessings[rel][style][length_id]

        if len(bucket) >= TARGET_PER_BUCKET:
            return 0

        # Exact dedup
        norm = normalize_text(text)
        if norm in self.normalized_set:
            return 0

        # Near-dedup against same bucket
        existing_texts = [item["text"] for item in bucket]
        if is_similar(text, existing_texts):
            return 0

        bucket.append({
            "text": text,
            "char_count": cc,
            "source_url": source_url,
        })
        self.normalized_set.add(norm)
        return 1

    def _add_blessing_auto_classify(self, text: str, source_url: str,
                                     hint_rel: str | None = None,
                                     hint_style: str | None = None) -> int:
        """Add a blessing with auto-detected relationship and style.
        hint_rel/hint_style provide fallback classification if detection fails."""
        text = clean_blessing_text(text)
        if not filter_blessing(text):
            return 0

        # Detect or use hint
        rel = detect_relationship(text) or hint_rel
        if rel is None:
            return 0

        style = detect_style(text) or hint_style
        if style is None:
            # Default assignment based on text characteristics
            style = "formal"  # safest default

        return self._add_blessing(text, rel, style, source_url)

    def _combo_key(self, rel: str, style: str) -> str:
        return f"{rel}:{style}"

    def _is_combo_done(self, rel: str, style: str) -> bool:
        """Check if all three length buckets for this combo are full."""
        return all(
            len(self.blessings[rel][style][length]) >= TARGET_PER_BUCKET
            for length in LENGTHS
        )

    def _scrape_page_for_combo(self, url: str, rel: str, style: str) -> int:
        """Fetch and extract blessings from one URL for a specific combo."""
        html = fetch_page(self.session, url)
        if html is None:
            return 0

        candidates = extract_blessings_from_html(html)
        added = 0
        for text in candidates:
            added += self._add_blessing(text, rel, style, url)
        return added

    def _search_and_scrape(self, queries: list[str], rel: str, style: str,
                           engine: str = "weixin") -> int:
        """Run search queries and scrape resulting pages."""
        all_urls = []
        for q in queries:
            print(f"  Searching ({engine}): {q}")
            if engine == "weixin":
                urls = weixin_sogou_search_urls(self.session, q, pages=3)
            else:
                urls = sogou_search_urls(self.session, q, pages=2)
            all_urls.extend(urls)
            print(f"    Found {len(urls)} URLs")

        # Deduplicate
        seen = set()
        unique_urls = []
        for url in all_urls:
            if url not in seen:
                seen.add(url)
                unique_urls.append(url)

        print(f"  Unique URLs to crawl: {len(unique_urls)}")

        added_total = 0
        for i, url in enumerate(unique_urls):
            if self._is_combo_done(rel, style):
                print(f"  [FULL] All buckets filled, stopping early")
                break

            print(f"  [{i+1}/{len(unique_urls)}] {url[:80]}...")
            added = self._scrape_page_for_combo(url, rel, style)
            if added > 0:
                print(f"    +{added}")
            added_total += added
            random_delay(1, 3)

        return added_total

    def _scrape_seeds_bulk(self):
        """Phase 1: Scrape seed URLs and auto-classify blessings into all combos."""
        print("\n" + "=" * 60)
        print("Phase 1: Scraping seed URLs (bulk classification)")
        print("=" * 60)

        all_seed_urls = set()
        for urls in SEED_URLS.values():
            all_seed_urls.update(urls)
        all_seed_urls.update(WECHAT_SEED_URLS)

        for i, url in enumerate(sorted(all_seed_urls)):
            print(f"\n  [{i+1}/{len(all_seed_urls)}] {url[:80]}...")
            html = fetch_page(self.session, url)
            if html is None:
                continue

            candidates = extract_blessings_from_html(html)
            added = 0
            for text in candidates:
                added += self._add_blessing_auto_classify(text, url)
            print(f"    Extracted {len(candidates)} candidates, added {added}")
            random_delay(1, 2)

        self._save_output()
        self._report_bucket_status("After Phase 1")

    def _scrape_combo(self, rel: str, style: str):
        """Phase 2: Targeted scraping for a specific combo via search."""
        key = self._combo_key(rel, style)

        if self.resume and self.progress.get(key):
            print(f"  [SKIP] {key} already completed")
            return

        if self._is_combo_done(rel, style):
            print(f"  [FULL] {key} all buckets full")
            self.progress[key] = True
            return

        print(f"\n--- Scraping: {REL_LABELS[rel]}x{STYLE_LABELS[style]} ({key}) ---")

        # Build queries
        queries = build_queries(rel, style)
        queries.extend(build_long_queries(rel, style))

        # Try WeChat search first (primary source)
        self._search_and_scrape(queries, rel, style, engine="weixin")

        # If still not done, try Sogou web search
        if not self._is_combo_done(rel, style):
            extra_queries = [queries[0]]
            self._search_and_scrape(extra_queries, rel, style, engine="sogou")

        # Also try seed URLs with targeted classification
        if not self._is_combo_done(rel, style):
            seed_urls = SEED_URLS.get(rel, [])
            for url in seed_urls:
                if self._is_combo_done(rel, style):
                    break
                added = self._scrape_page_for_combo(url, rel, style)
                if added > 0:
                    print(f"    Seed {url[:50]}... +{added}")

        # Report status
        for length in LENGTHS:
            count = len(self.blessings[rel][style][length])
            status = "OK" if count >= TARGET_PER_BUCKET else f"{count}/{TARGET_PER_BUCKET}"
            print(f"  {length}: {status}")

        if self._is_combo_done(rel, style):
            self.progress[key] = True

        self._save_progress()
        self._save_output()

    def _report_bucket_status(self, label: str = ""):
        """Quick status report."""
        total = sum(
            len(self.blessings[r][s][l])
            for r in RELATIONSHIPS for s in STYLES for l in LENGTHS
        )
        full = sum(
            1 for r in RELATIONSHIPS for s in STYLES for l in LENGTHS
            if len(self.blessings[r][s][l]) >= TARGET_PER_BUCKET
        )
        print(f"\n  [{label}] Total: {total}, Full buckets: {full}/90")

    def scrape_all(self):
        """Run the full scraping pipeline."""
        print("Starting blessing scraper...")
        print(f"Target: 90 buckets x {TARGET_PER_BUCKET} = {90 * TARGET_PER_BUCKET} blessings\n")

        # Phase 1: Bulk scrape from seed URLs
        self._scrape_seeds_bulk()

        # Phase 2: Targeted search for each combo
        print("\n" + "=" * 60)
        print("Phase 2: Targeted search per combo")
        print("=" * 60)

        total_combos = len(RELATIONSHIPS) * len(STYLES)
        done = 0
        for rel in RELATIONSHIPS:
            for style in STYLES:
                done += 1
                print(f"\n{'='*40} [{done}/{total_combos}]")
                self._scrape_combo(rel, style)

        self._save_output()
        print(f"\n{'='*60}")
        print("Scraping complete!")
        self.print_stats()

    def print_stats(self):
        """Print coverage statistics."""
        print(f"\n{'='*60}")
        print("Coverage Statistics")
        print(f"{'='*60}\n")

        total = 0
        full = 0
        gaps = []

        header = f"{'Rel':>10} {'Style':>8} {'short':>6} {'medium':>7} {'long':>6}"
        print(header)
        print("-" * len(header))

        for rel in RELATIONSHIPS:
            for style in STYLES:
                counts = []
                for length in LENGTHS:
                    c = len(self.blessings[rel][style][length])
                    total += c
                    if c >= TARGET_PER_BUCKET:
                        full += 1
                    else:
                        gaps.append(f"{REL_LABELS[rel]}x{STYLE_LABELS[style]}x{length} ({c}/{TARGET_PER_BUCKET})")
                    counts.append(c)
                print(f"{REL_LABELS[rel]:>10} {STYLE_LABELS[style]:>8} {counts[0]:>6} {counts[1]:>7} {counts[2]:>6}")

        total_buckets = len(RELATIONSHIPS) * len(STYLES) * len(LENGTHS)
        print(f"\nTotal blessings: {total}")
        print(f"Full buckets: {full}/{total_buckets} ({100*full/total_buckets:.1f}%)")

        if gaps:
            print(f"\nGaps ({len(gaps)} buckets below target):")
            for g in gaps:
                print(f"  - {g}")

    def dry_run(self):
        """Print all search queries without making any requests."""
        print("DRY RUN: Generated search queries\n")
        total_queries = 0

        print("=== Seed URLs ===")
        all_seeds = set()
        for rel, urls in SEED_URLS.items():
            print(f"\n[{REL_LABELS[rel]}]")
            for url in urls:
                print(f"  - {url}")
                all_seeds.add(url)
        print(f"\nTotal unique seed URLs: {len(all_seeds)}")

        print("\n=== Search Queries (per combo) ===\n")
        for rel in RELATIONSHIPS:
            for style in STYLES:
                queries = build_queries(rel, style)
                queries.extend(build_long_queries(rel, style))
                print(f"[{REL_LABELS[rel]}x{STYLE_LABELS[style]}]")
                for q in queries:
                    print(f"  - {q}")
                    total_queries += 1
                print()

        print(f"Total: {len(all_seeds)} seed URLs + {total_queries} search queries")
        print(f"Target: 90 buckets x {TARGET_PER_BUCKET} = {90 * TARGET_PER_BUCKET} blessings")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="新年祝福语爬虫脚本")
    parser.add_argument("--resume", action="store_true", help="断点续爬，跳过已完成组合")
    parser.add_argument("--stats", action="store_true", help="查看已有数据覆盖率")
    parser.add_argument("--dry-run", action="store_true", help="只显示搜索词不实际爬取")
    args = parser.parse_args()

    if args.dry_run:
        scraper = BlessingScraper(resume=False)
        scraper.dry_run()
        return

    if args.stats:
        scraper = BlessingScraper(resume=True)
        scraper.print_stats()
        return

    scraper = BlessingScraper(resume=args.resume)
    scraper.scrape_all()


if __name__ == "__main__":
    main()
