# Task Plan - Blessing 迁移到 Vercel

## 总体进度
- 已完成: 90%
- 当前阶段: Phase 4（需要用户操作）

---

## 任务清单

### Phase 1: 创建 Vercel Serverless Functions [completed]
- [x] 创建 lib/types.ts — 服务端类型定义
- [x] 创建 lib/providers.ts — 6 个 LLM 提供商配置，从环境变量读取 API Key
- [x] 创建 lib/promptBuilder.ts — 5 层 prompt 构建（马年主题+关系+风格+长度+个性化+few-shot）
- [x] 创建 lib/blessingStore.ts — 4 级 fallback 祝福语查找 + Fisher-Yates 随机选取
- [x] 创建 api/health.ts — GET /api/health 健康检查
- [x] 创建 api/models.ts — GET /api/models 返回已配置的模型列表
- [x] 创建 api/generate.ts — POST /api/generate SSE 流式生成（maxDuration=60s）
- [x] 创建 vercel.json — rewrites + functions 配置
- [x] TypeScript 编译验证通过

### Phase 2: 前端重构 [completed]
- [x] 更新 src/types.ts — 删除 Provider 接口，新增 ModelInfo
- [x] 重写 src/services/llm.ts — fetchModels() + createGenerateStream()，解析简化 SSE 格式
- [x] 创建 src/hooks/useModelSelect.ts — 模型列表获取 + localStorage 记住选择
- [x] 创建 src/components/ModelSelector.tsx — 下拉选择框，按 provider 分组
- [x] 修改 src/hooks/useGenerate.ts — 去掉前端 prompt 构建，改用 createGenerateStream
- [x] 修改 src/App.tsx — 去掉 useProviders/ApiConfigModal，加 useModelSelect/ModelSelector
- [x] 修改 src/components/Header.tsx — 去掉 API 配置按钮
- [x] 修改 src/components/InputPanel.tsx — isConfigured → canGenerate
- [x] 更新 vite.config.ts — 去掉 proxy 配置
- [x] 更新 package.json — 去掉 express 依赖，加 vercel-build 脚本
- [x] 删除旧文件: server/, src/hooks/useProviders.ts, src/components/ApiConfigModal.tsx, src/skills/

### Phase 3: 测试与验证 [completed]
- [x] npm run build 通过（tsc -b + vite build）
- [x] npm run lint 通过（ESLint 无警告）
- [x] 服务端 TypeScript 独立编译验证通过
- [x] 全面代码审查通过

### Phase 4: Vercel 部署 [suspended]
- [x] Git 初始化 + 初始提交（commit b99533f）
- [ ] 推送到 GitHub — **需要用户操作**（gh CLI 未安装）
- [ ] Vercel 项目配置 — **需要用户操作**
- [ ] 设置环境变量 — **需要用户操作**

---

## 决策记录

### 决策 2026-02-15 00:40
#### 问题
lib/ 目录的类型定义如何与 src/types.ts 共享？

#### 选择的方案
在 lib/types.ts 中定义服务端需要的类型（Relationship, Style, Length, GenerateOptions），前端 src/types.ts 保持独立（包含 UI 相关的 RELATIONSHIPS, STYLES, LENGTHS 常量）。两者类型值相同但独立维护。

#### 原因
1. Vercel serverless functions 和 Vite 前端使用不同的 tsconfig 和编译流程
2. 这些类型是简单的字符串联合类型，重复定义的维护成本很低
3. 避免跨编译目标的复杂引用配置

### 决策 2026-02-15 00:41
#### 问题
api/generate.ts 的 SSE 返回格式

#### 选择的方案
使用简化格式：`data: {"token":"X"}\n\n`，服务端解析上游 OpenAI 格式后重新编码

#### 原因
1. 前端不需要关心不同 LLM 提供商的响应格式差异
2. 减少前端解析复杂度
3. 统一接口，未来切换提供商不影响前端

### 决策 2026-02-15 01:00
#### 问题
lib/blessingStore.ts 如何在 Vercel serverless 中加载 blessings.json？

#### 选择的方案
使用静态 `import blessingsData from '../blessings.json'`

#### 原因
1. Vercel 使用 esbuild 打包 serverless functions，静态 import 确保 JSON 被正确内联
2. `fs.readFileSync(process.cwd() + '/blessings.json')` 可能在 Vercel 部署时找不到文件
3. 静态 import 与前端代码保持一致的模式

### 决策 2026-02-15 01:05
#### 问题
git config 未设置

#### 选择的方案
使用 `git config user.email "luka@users.noreply.github.com"` 和 `git config user.name "luka"`（仅本仓库级别）

#### 原因
遵守不修改全局 git config 的约定，仅设置此仓库的身份

---

## 障碍记录

### 推送到 GitHub + Vercel 部署
- 任务: Phase 4 — 推送到 GitHub 和 Vercel 部署
- 原因: `gh` CLI 未安装，无法创建 GitHub 仓库和推送代码
- 需要的资源:
  1. 安装 gh CLI: `sudo apt install gh` 或 `snap install gh`
  2. 登录 GitHub: `gh auth login`
  3. 创建仓库并推送:
     ```bash
     cd /home/luka/Projects/blessing
     gh repo create blessing --public --source=. --push
     ```
  4. 在 Vercel Dashboard 中:
     - Import 这个 GitHub 仓库
     - Framework Preset 选 Vite
     - Build Command: `vite build`
     - Output Directory: `dist`
     - 在 Settings → Environment Variables 设置 API Keys
- 状态: suspended

---

## 文件清单（最终）

### 新增文件
| 文件 | 作用 |
|------|------|
| `api/generate.ts` | POST /api/generate — SSE 流式生成（核心） |
| `api/models.ts` | GET /api/models — 返回已配置的模型列表 |
| `api/health.ts` | GET /api/health — 健康检查 |
| `lib/types.ts` | 服务端类型定义 |
| `lib/providers.ts` | 6 个 LLM 提供商配置 + 环境变量 API Key 管理 |
| `lib/promptBuilder.ts` | 5 层 prompt 构建（从 src/skills/ 迁移） |
| `lib/blessingStore.ts` | 4 级 fallback 祝福语查找（从 src/skills/ 迁移） |
| `vercel.json` | Vercel 部署配置 |
| `src/hooks/useModelSelect.ts` | 模型选择 Hook |
| `src/components/ModelSelector.tsx` | 模型下拉选择器 |

### 修改文件
| 文件 | 改动 |
|------|------|
| `src/types.ts` | 删除 Provider，新增 ModelInfo |
| `src/services/llm.ts` | 重写：fetchModels() + createGenerateStream() |
| `src/hooks/useGenerate.ts` | 去掉前端 prompt 构建，改用 createGenerateStream |
| `src/App.tsx` | 去掉 ApiConfigModal，加 ModelSelector |
| `src/components/Header.tsx` | 去掉 API 配置按钮 |
| `src/components/InputPanel.tsx` | isConfigured → canGenerate |
| `vite.config.ts` | 去掉 proxy 配置 |
| `package.json` | 去掉 express，加 vercel-build |
| `.gitignore` | 加 .vercel, .agents, .claude |
| `.env.example` | 更新说明 |

### 删除文件
| 文件 | 原因 |
|------|------|
| `server/` 目录 | 功能由 api/ + lib/ 替代 |
| `src/hooks/useProviders.ts` | 不再需要用户管理 API Key |
| `src/components/ApiConfigModal.tsx` | 不再需要 |
| `src/skills/promptBuilder.ts` | 迁移到 lib/ |
| `src/skills/blessingStore.ts` | 迁移到 lib/ |
