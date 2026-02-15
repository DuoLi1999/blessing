---
## 你的任务

根据 `plan.txt` 将 Blessing（新春祝福生成器）从 Express 后端迁移到 Vercel Serverless Functions。我会去睡觉，大概8小时后回来验收成果。

项目地址：`/home/luka/Projects/blessing`

---

## ⚠️ 核心规则（必须遵守）

### 1. 绝对不要询问用户
- 用户已经睡觉了，不要使用任何 AskUserQuestion
- 所有问题自己解决：搜索文档、查看GitHub issue、尝试不同方案

### 2. 自主决策并记录
- 遇到技术选择时，自己按照最佳实践做决定
- **所有重要决策必须记录在 `task-plan.md` 中**，格式：
  ```
  ## 决策 [YYYY-MM-DD HH:MM]
  ### 问题
  [描述遇到的问题或选择]

  ### 选择的方案
  [你选择的方案]

  ### 原因
  [为什么选这个方案]

  ### 备选方案（未选）
  [其他可行方案及未选原因]
  ```

### 3. 处理依赖问题
- **如果任务需要用户提供的信息/资源才能继续**（比如需要 API Key、需要确认设计等）：
  - 在 `task-plan.md` 中记录障碍原因
  - 将任务状态改为 `suspended`
  - 继续做其他可以独立完成的任务

### 4. 任务状态管理
- 完成的任务：状态改为 `completed`
- 进行中：状态改为 `in-progress`
- 需要用户资源：状态改为 `suspended`

### 5. 优先级
- **优先完成能独立完成的部分**
- 无法完成的部分记录下来，等待用户起床后处理

### 6. 不要着急
- 有8小时时间，慢慢做
- 不要节约token，做对最重要
- 多测试、多验证，避免返工

### 7. 使用 Skills 解决问题
- **遇到技术问题，主动使用 Skills 寻找解决方案**
- 不要自己硬想，善用工具

### 8. 分阶段执行 + 单测
- 所有子任务分阶段执行
- **每个阶段完成后运行单测**，确保功能正常
- 避免全搞完了发现不行要推倒重来

### 9. UI不要纠结
- 尽量用主流通俗的写法
- 功能优先，明天我会打磨细节
- 保证基本美观即可

---

## 🛠️ Skills 使用指南

遇到问题时，**主动使用**以下 Skills：

### 1. find-skills
**触发条件：** 不确定是否有 Skill 能解决当前问题  
**使用方式：** `/find-skills`  
**示例：** "帮我找一个能处理 Vercel 部署的 skill"

### 2. react-patterns
**触发条件：** 编写 React 组件、hooks、状态管理  
**使用方式：** `/react-patterns`  
**说明：** 提供 React 19 最佳实践、性能优化建议

### 3. vercel-composition-patterns
**触发条件：** 配置 Vercel Serverless Functions、路由、流式响应  
**使用方式：** `/vercel-composition-patterns`  
**说明：** Vercel Functions 专用指南，包含 SSE 实现

### 4. code-review
**触发条件：** 完成一个 Phase 后，请求代码审查  
**使用方式：** `/code-review`  
**说明：** 自动检查代码质量、潜在问题

### 5. security-auditor
**触发条件：** 处理 API Keys、环境变量、用户输入  
**使用方式：** `/security-auditor`  
**说明：** 检查安全漏洞、敏感信息泄露

### 6. web-search-plus
**触发条件：** 遇到不确定的技术问题  
**使用方式：** `/web-search-plus [你的问题]`  
**说明：** 智能搜索，获取最新文档和解决方案

---

## 📋 任务计划文件

你必须创建并持续更新 `task-plan.md`，格式：

```markdown
# Task Plan - Blessing 迁移到 Vercel

## 总体进度
- 已完成: X%
- 预计完成时间: [预计时间]

---

## 任务清单

### Phase 1: 创建 Vercel Serverless Functions [in-progress]
- [ ] 创建 api/ 目录结构
- [ ] 迁移 lib/providers.ts
- [ ] 迁移 lib/promptBuilder.ts
- [ ] 迁移 lib/blessingStore.ts
- [ ] 创建 api/models.ts
- [ ] 创建 api/health.ts
- [ ] 创建 api/generate.ts (SSE 流式)
- [ ] 创建 vercel.json
- [ ] 本地测试 API
- 状态: in-progress

### Phase 2: 前端重构
- [ ] 更新 src/types.ts
- [ ] 重写 src/services/llm.ts
- [ ] 创建 src/hooks/useModelSelect.ts
- [ ] 创建 src/components/ModelSelector.tsx
- [ ] 修改 src/hooks/useGenerate.ts
- [ ] 修改 src/App.tsx
- [ ] 修改 src/components/Header.tsx
- [ ] 修改 src/components/InputPanel.tsx
- [ ] 更新 vite.config.ts
- [ ] 更新 package.json
- [ ] 删除旧文件
- 状态: pending

### Phase 3: 测试与验证
- [ ] API 端点测试
- [ ] 功能测试 (3种风格并行)
- [ ] 安全检查 (security-auditor)
- [ ] 代码审查 (code-review)
- 状态: pending

### Phase 4: Vercel 部署
- [ ] Git 初始化并推送
- [ ] Vercel 项目配置
- [ ] 设置环境变量
- [ ] 生产环境部署
- [ ] 线上验证
- 状态: pending

---

## 决策记录

[记录所有重要决策]

### 决策 [YYYY-MM-DD HH:MM]
#### 问题
[描述问题]

#### 使用的 Skill
[使用的 Skill 名称]

#### 选择的方案
[最终选择]

#### 原因
[为什么]

#### 代码变更
[相关文件]

---

## 障碍记录

### [障碍1]
- 任务: [某个任务]
- 原因: [为什么卡住]
- 需要的资源: [需要用户提供什么]
- 状态: suspended

---

## 问题与解决方案

### [问题1]
- 问题描述: ...
- 使用的 Skill: ...
- 解决方案: ...
- 参考资源: ...
```

---

## 🚀 工作流程

### Phase 1: 创建 Vercel Serverless Functions (1.5小时)

**目标：** 将现有 Express 后端迁移到 Vercel Serverless

**步骤：**
1. **创建目录结构**
   ```
   blessing/
   ├── api/                          # Vercel Serverless Functions
   │   ├── generate.ts               # POST /api/generate (SSE 流式)
   │   ├── models.ts                 # GET /api/models
   │   └── health.ts                 # GET /api/health
   ├── lib/                          # 服务端共享代码
   │   ├── providers.ts              # Provider 注册表
   │   ├── promptBuilder.ts          # Prompt 构建
   │   └── blessingStore.ts          # Few-shot 示例
   ```

2. **创建 `lib/providers.ts`**
   - 从 `server/providers.js` 迁移
   - 改为 TypeScript
   - 从环境变量读取 API Key：`process.env.DEEPSEEK_API_KEY`
   - 实现 `getAvailableModels()` - 只返回配置了 key 的 provider
   - 实现 `getProviderConfig(id)` - 返回 { baseUrl, model, apiKey }
   - **检查 Skill：** `/vercel-composition-patterns`

3. **创建 `lib/promptBuilder.ts`**
   - 从 `src/skills/promptBuilder.ts` 复制
   - 无需大幅修改（纯逻辑，不依赖浏览器 API）
   - **检查 Skill：** `/react-patterns` 确保 TypeScript 类型

4. **创建 `lib/blessingStore.ts`**
   - 从 `src/skills/blessingStore.ts` 复制
   - 修改 JSON 导入方式：使用 `fs.readFileSync` 或动态 import
   - **检查 Skill：** `/vercel-composition-patterns` 处理服务端文件读取

5. **创建 API 端点**
   - `api/models.ts` - GET /api/models，返回可用模型列表
   - `api/health.ts` - GET /api/health，返回 { status: "ok" }
   - `api/generate.ts` - POST /api/generate，SSE 流式生成（核心）
     - 使用 `export const config = { maxDuration: 60 }`
     - 解析请求体：{ model, relationship, style, length, name?, note?, reference? }
     - 调用 lib/providers.ts 获取配置
     - 调用 lib/promptBuilder.ts 构建 prompt
     - 调用 lib/blessingStore.ts 获取 few-shot
     - fetch LLM API，stream 模式
     - SSE 格式返回：`data: {"token":"马"}\n\n`
     - 结束：`data: [DONE]\n\n`

6. **创建 `vercel.json`**
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/$1" },
       { "source": "/((?!api/).*)", "destination": "/index.html" }
     ],
     "functions": {
       "api/generate.ts": { "maxDuration": 60 }
     }
   }
   ```

**验证：**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地运行
vercel dev

# 测试 API
curl http://localhost:3000/api/health
curl http://localhost:3000/api/models
curl -N -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","relationship":"friend","style":"casual","length":"medium"}'
```

**决策记录：**
- Provider 配置方案
- SSE 实现方式

---

### Phase 2: 前端重构 (2小时)

**目标：** 移除 API Key 管理，添加模型选择器

**步骤：**
1. **更新类型定义** (`src/types.ts`)
   - 删除 Provider 接口
   - 新增 ModelInfo：{ id: string, name: string, provider: string }

2. **重写 LLM 服务** (`src/services/llm.ts`)
   - 删除现有的 `createLLMStream(provider, apiKey, ...)`
   - 新增 `fetchModels(): Promise<ModelInfo[]>` - GET /api/models
   - 新增 `createGenerateStream(model, options, callbacks, signal)`
     - 不再传 provider 和 apiKey
     - 直接传 { model, relationship, style, length, name, note, reference }
     - SSE 解析逻辑复用现有代码
   - **检查 Skill：** `/react-patterns`

3. **创建模型选择 Hook** (`src/hooks/useModelSelect.ts`)
   - useEffect 中调用 fetchModels() 获取可用模型
   - localStorage 记住用户选择（key: "blessing-selected-model"）
   - 暴露：{ models, selectedModel, setSelectedModel, loading, error }
   - **检查 Skill：** `/react-patterns`

4. **创建模型选择器组件** (`src/components/ModelSelector.tsx`)
   - 下拉选择框，显示模型名称
   - 按 provider 分组（如果多个 provider 有模型）
   - 沿用现有金色主题风格
   - **检查 Skill：** `/react-patterns` + `/tailwind-ui-patterns`

5. **修改 useGenerate** (`src/hooks/useGenerate.ts`)
   - generate() 参数：从 `(provider, apiKey, options)` 改为 `(model, options)`
   - 删除前端 prompt 构建逻辑（buildPrompt 调用）
   - 删除前端 few-shot 获取逻辑（getBlessings 调用）
   - 改为调用新的 `createGenerateStream(model, options, callbacks, signal)`
   - 仍然保留 3 个并行流（每种 style 一个）的架构

6. **修改 App.tsx**
   - 删除 `useProviders` 导入和调用
   - 删除 `ApiConfigModal` 渲染
   - 新增 `useModelSelect` 调用
   - 新增 `ModelSelector` 渲染（放在 Header 下方或 InputPanel 内）
   - generate 调用改为传 selectedModel

7. **修改 Header.tsx**
   - 删除设置按钮（齿轮图标 + 红点指示器）
   - 删除 isConfigured / onConfigClick props

8. **修改 InputPanel.tsx**
   - 删除 isConfigured prop 相关的按钮禁用逻辑
   - 生成按钮的禁用条件改为：`!selectedModel || !relationship`

9. **更新配置**
   - `vite.config.ts` - 删除 server.proxy 配置（本地开发用 vercel dev）
   - `package.json` - 添加 "vercel-build": "vite build"，删除 express 相关依赖

**删除的文件：**
- `src/hooks/useProviders.ts`
- `src/components/ApiConfigModal.tsx`
- `src/skills/promptBuilder.ts`
- `src/skills/blessingStore.ts`
- `server/` 目录

**验证：**
- 模型列表正常加载
- 生成按钮状态正确
- 页面无报错

**决策记录：**
- Hook 设计方案
- 组件拆分策略

---

### Phase 3: 测试与验证 (1小时)

**目标：** 确保所有功能正常

**步骤：**
1. **API 测试**
   ```bash
   # 健康检查
   curl http://localhost:3000/api/health
   
   # 模型列表
   curl http://localhost:3000/api/models
   
   # 流式生成测试
   curl -N -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"model":"deepseek-chat","relationship":"friend","style":"casual","length":"medium"}'
   ```

2. **功能测试**
   - [ ] 打开应用，模型列表加载
   - [ ] 选择模型，记住选择（刷新后仍在）
   - [ ] 填写表单（关系类型、收礼人姓名等）
   - [ ] 点击生成，3 种风格并行生成
   - [ ] SSE 流式逐字显示
   - [ ] 取消生成功能正常
   - [ ] 手机浏览器正常访问

3. **安全检查**
   - **使用 Skill：** `/security-auditor`
   - 检查环境变量不泄露到前端
   - 检查用户输入验证
   - 检查 API 响应安全

4. **代码审查**
   - **使用 Skill：** `/code-review`
   - 审查所有修改的文件

**问题记录：**
在 `task-plan.md` 中记录所有问题和解决方案

---

### Phase 4: Vercel 部署 (30分钟)

**目标：** 部署到生产环境

**步骤：**
1. **Git 初始化**
   ```bash
   cd /home/luka/Projects/blessing
   git init
   git add -A
   git commit -m "feat: migrate to Vercel Serverless Functions"
   ```

2. **推送到 GitHub**
   ```bash
   gh repo create blessing --public --source=. --push
   # 或手动创建仓库后 push
   ```

3. **Vercel 配置**
   - 登录 https://vercel.com
   - Import GitHub 仓库
   - Framework Preset: Vite
   - Build Command: `vite build`
   - Output Directory: `dist`

4. **设置环境变量**（在 Vercel Dashboard）
   ```
   DEEPSEEK_API_KEY=sk-xxx
   OPENAI_API_KEY=sk-xxx
   ZHIPU_API_KEY=xxx
   MOONSHOT_API_KEY=xxx
   DASHSCOPE_API_KEY=xxx
   SILICONFLOW_API_KEY=xxx
   ```
   - 只需配置你有的 key，没配置的 provider 不会出现在列表中

5. **部署**
   ```bash
   npx vercel --prod
   ```

6. **验证部署**
   ```bash
   curl https://<your-app>.vercel.app/api/health
   curl https://<your-app>.vercel.app/api/models
   ```
   - 浏览器打开 https://<your-app>.vercel.app 验证完整功能

**输出文档：**
在 `task-plan.md` 记录：
- 项目 URL
- Vercel 项目地址
- 部署时间

---

## 📦 输出文件清单

### 代码文件
**Serverless Functions:**
- `api/generate.ts` - SSE 流式生成 API
- `api/models.ts` - 模型列表 API  
- `api/health.ts` - 健康检查 API

**服务端共享代码:**
- `lib/providers.ts` - Provider 配置
- `lib/promptBuilder.ts` - Prompt 构建
- `lib/blessingStore.ts` - Few-shot 示例

**前端修改:**
- `src/services/llm.ts` - 重写后的 LLM 服务
- `src/hooks/useModelSelect.ts` - 模型选择 Hook
- `src/hooks/useGenerate.ts` - 修改后的生成 Hook
- `src/components/ModelSelector.tsx` - 模型选择器组件
- `src/App.tsx` - 修改后的主组件
- `src/components/Header.tsx` - 修改后的头部
- `src/components/InputPanel.tsx` - 修改后的输入面板
- `src/types.ts` - 更新后的类型定义

### 配置文件
- `vercel.json` - Vercel 配置
- `vite.config.ts` - 更新后的 Vite 配置
- `package.json` - 更新后的依赖

### 文档文件
- `task-plan.md` - 任务计划和决策记录

---

## 🎯 验收标准

### MVP 必须完成（最低要求）
- ✅ Vercel Serverless Functions 正常运行
- ✅ `/api/models` 返回已配置的模型
- ✅ `/api/generate` SSE 流式生成正常
- ✅ 前端模型选择器可用
- ✅ 3 种风格并行生成正常
- ✅ 取消生成功能正常
- ✅ 部署到 Vercel 可访问

### 理想情况
- ✅ 响应速度 < 2s
- ✅ 移动端适配良好
- ✅ 代码通过 security-auditor 检查
- ✅ 完整的文档和决策记录

---

## ❌ 错误处理

### 如果遇到无法解决的问题

1. 在 `task-plan.md` 中记录：
   ```markdown
   ### 问题记录 [YYYY-MM-DD HH:MM]
   - 任务: [任务名称]
   - 问题描述: [具体问题]
   - 尝试过的方案: [你试过的所有方案]
   - 使用的 Skill: [尝试过的 skills]
   - 参考资源: [搜索到的文档/issue链接]
   - 状态: blocked / workaround-found
   - 建议: [对用户的建议]
   ```

2. 不要卡住，继续做其他任务

### 如果时间不够

1. 优先完成核心功能：
   - Phase 1（必须完成，否则无法运行）
   - Phase 2（必须完成，否则无法使用）
   - Phase 3（重要，确保质量）
   - Phase 4（尽量完成）

2. 在 `task-plan.md` 中标记：
   - ✅ 已完成
   - 🚧 进行中
   - ⏸️ 暂未实现 (说明原因和建议)

---

## ✅ 代码质量要求

1. **组件化**：合理拆分，避免超大组件
2. **类型安全**：使用 TypeScript，明确定义接口
3. **代码可读性**：清晰命名，必要注释
4. **性能优化**：React.memo、useMemo、useCallback
5. **错误处理**：合理的 try-catch 和错误提示

---

## 🌙 开始工作

1. 仔细阅读 `plan.txt`
2. 创建 `task-plan.md`
3. 开始 Phase 1
4. **每完成一个 Phase，使用 `/code-review` 审查代码**
5. **遇到技术问题，立即使用相应 Skill**
6. 每30分钟更新一次 task-plan.md 进度
7. 明天早上我来验收

**记住：慢慢做，做对最重要。善用 Skills，晚安！💤**
