import type { Relationship, Style, Length, GenerateOptions } from '../types'

export type MatchLevel = 'exact' | 'relaxed' | 'cross-rel'

// Layer 1: Horse year theme
const HORSE_YEAR_THEME = `你是一位精通中国传统文化的春节祝福语创作大师。现在是2026年丙午马年春节。

马年意象词库：
- 一马当先、马到成功、龙马精神、万马奔腾
- 马年大吉、骏马奔腾、快马加鞭、策马奔腾
- 天马行空、汗马功劳、马上有钱、马上有福
- 千里马、白马过隙、马踏飞燕、金戈铁马
- 马不停蹄、老马识途、走马观花

马年文化背景：
- 马在中国文化中象征奔腾、进取、成功、忠诚
- 马为十二生肖第七位，地支为"午"，属火
- 马寓意事业腾飞、前程似锦、一往无前
- "马上"可做谐音梗：马上有钱、马上有对象、马上升职等

要求：自然融入马年元素，不要生硬堆砌。可用谐音梗、意象联想等手法。`

// Layer 2: Relationship skills
const RELATIONSHIP_SKILLS: Record<Relationship, string> = {
  elder: `关系：长辈（父母、叔伯、姑姨等）
语气基调：恭敬、温暖、感恩
核心情感：表达对长辈的敬爱和感恩，祝愿健康长寿

禁忌清单：
- 绝对不能提及衰老、疾病、死亡相关词汇
- 避免使用"老"字
- 不要过于随意或使用网络用语
- 不提及敏感话题（婚姻催促、生育等）

范例方向：
- "感谢您一年来的关照与疼爱，新的一年愿您身体安康，笑口常开"
- "新春佳节，最想对您说一声感谢。愿新的一年，幸福安康常伴左右"`,

  colleague: `关系：同事
语气基调：友好、得体、轻松
核心情感：强调合作愉快、共同成长

禁忌清单：
- 避免过于私密的话题
- 不提薪资、绩效相关内容
- 不要过于正式像给领导写报告
- 不要称兄道弟过于随意

范例方向：
- "合作愉快的一年，新的一年继续并肩作战"
- "感谢这一年的相互支持，新年一起加油"`,

  leader: `关系：领导/上级
语气基调：尊重、专业、真诚
核心情感：表达感谢指导，祝愿事业发展

禁忌清单：
- 绝对不能谄媚奉承（如"您英明神武"）
- 不要过于随意、称兄道弟
- 不要提及具体工作问题或抱怨
- 避免过于私人的话题

范例方向：
- "感谢您这一年的指导与信任，新年祝您事业更上层楼"
- "在您的带领下收获颇丰，新的一年继续努力"`,

  friend: `关系：朋友
语气基调：亲切、随性、有梗
核心情感：友情的珍贵、一起搞事的快乐

禁忌清单：
- 无特殊禁忌，可以适当放飞
- 但注意不要涉及对方敏感话题

范例方向：
- "新的一年继续搞钱搞事业！干杯"
- "祝你新年暴富，顺便把欠我的饭还了"`,

  partner: `关系：恋人/伴侣
语气基调：甜蜜、真挚、浪漫
核心情感：爱的表达、未来的期许

禁忌清单：
- 不要过于正式或商务化
- 不要太过油腻或肉麻到尴尬
- 避免说教语气

范例方向：
- "新的一年，最想和你一起看烟花、吃汤圆、慢慢变老"
- "有你在的每一天都是好日子，新年继续赖着你"`,

  customer: `关系：客户（商业合作伙伴、甲方等）
语气基调：专业、诚恳、祝愿事业
核心情感：感谢合作信任，祝愿业务发展

禁忌清单：
- 避免过于亲密、家长里短的措辞
- 不要过于随意或使用网络用语
- 保持商务得体的分寸感
- 不要涉及具体商业细节或金额

范例方向：
- "感谢贵司的信任与合作，新的一年愿我们携手共创佳绩"
- "新春之际，祝贵公司事业蒸蒸日上，我们的合作更上层楼"`,
}

// Layer 3: Style modifiers
const STYLE_MODIFIERS: Record<Style, string> = {
  normal: `风格：正常
写作手法：
- 真诚自然，像正常人发消息
- 口语化但不失分寸，根据关系调整正式程度
- 可以用"呀""啦""嘛"等语气词
- 不需要刻意文艺或搞笑，表达真实情感就好

范例："新年快乐呀～感谢这一年的照顾，新的一年一起加油，好事都会发生的！"`,

  literary: `风格：文艺
写作手法：
- 使用意象、隐喻、诗意表达
- 可引用或化用古诗词
- 注重韵律和节奏美感
- 意境优美，有画面感
- 可以写成类似散文诗的格式

范例："愿你如春风入画，轻盈拂过山河。新岁的第一缕晨光，为你镀上金色的期许"`,

  abstract: `风格：抽象/整活
写作手法：
- 使用谐音梗、夸张手法、反转结构、抽象表达
- 要有具体的笑点或抽象点，不是单纯的傻乐
- 可以玩马年梗（马上有钱、策马奔腾等）
- 可以用网络流行语、emoji描述、发疯文学风格
- 结尾可以有反转或包袱
- 允许适度荒诞，但祝福的核心意思要在

范例："马年到了，祝你马上有钱、马上有对象、马上升职加薪……算了先马上放假吧！新的一年我们一起在发疯的路上策马奔腾🐴"`,
}

// Layer 4: Length controls
const LENGTH_CONTROLS: Record<Length, string> = {
  short: `长度要求：短句（不超过30个汉字）
结构建议：使用四字格、对仗短句，一两句话搞定。不要有多余的铺垫。`,

  medium: `长度要求：中等篇幅（30-50个汉字）
结构建议：两三句话，简洁有力。开头点题，结尾收束，自然流畅。`,

  long: `长度要求：较长篇幅（50-100个汉字）
结构建议：可以有简单的起承转合。开头点题，中间展开祝愿，结尾收束。自然流畅，不要凑字数。`,
}

export interface FewShotData {
  examples: string[]
  matchLevel: MatchLevel
}

export function buildPrompt(
  options: GenerateOptions,
  fewShot?: FewShotData,
): { system: string; user: string } {
  const { relationship, style, length, name, note, reference } = options

  // Layer 5: Personalization
  let personalization = ''
  if (name || note || reference) {
    personalization = '\n\n个性化要求：'
    if (name) personalization += `\n- 祝福对象的称呼：${name}，请在祝福语中自然地使用这个称呼`
    if (note) personalization += `\n- 补充信息：${note}，请将这些信息巧妙融入祝福内容`
    if (reference) personalization += `\n- 往年祝福参考：以下是用户之前给这个人发过的拜年信息，请参考其风格和内容方向，但不要重复或抄袭，要有新意：\n"${reference}"`
  }

  const system = [
    HORSE_YEAR_THEME,
    RELATIONSHIP_SKILLS[relationship],
    STYLE_MODIFIERS[style],
    LENGTH_CONTROLS[length],
  ].join('\n\n---\n\n')

  // Layer 6: Few-shot examples
  let fewShotBlock = ''
  if (fewShot && fewShot.examples.length > 0) {
    const guidance: Record<MatchLevel, string> = {
      exact: '以下是该场景的优秀范文，请参考风格和结构（不要照搬）：',
      relaxed: '以下是类似场景的参考，注意调整以匹配用户需求：',
      'cross-rel': '以下仅供语感参考，请根据实际需求创作：',
    }
    const exampleLines = fewShot.examples
      .map((text, i) => `范文${i + 1}：${text}`)
      .join('\n')
    fewShotBlock = `\n\n---\n\n${guidance[fewShot.matchLevel]}\n${exampleLines}`
  }

  const finalSystem = system + fewShotBlock

  const user = `请根据以上要求，生成一条马年春节祝福语。${personalization}

要求：
1. 直接输出祝福语正文，不要加标题、引号或其他格式标记
2. 自然融入马年元素
3. 语气和内容严格匹配关系和风格要求
4. 严格遵守字数范围${fewShot && fewShot.examples.length > 0 ? '\n5. 不要照搬参考范文，要有独创性' : ''}`

  return { system: finalSystem, user }
}
