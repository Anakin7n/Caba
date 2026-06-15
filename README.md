# Caba — 发现你的下一个产品灵感

像剥卷心菜一样，一层一层找到你内心最想做的产品。

一款通过苏格拉底式提问 + 滑动卡片决策 + LLM 意图收敛，帮助你发现自己真正想做的产品的 Web 应用。

vibecoding 时代，难的从来不是写代码，而是知道该写什么。

## 工作原理

1. **选方向** — 从工作、生活、爱好三个场景中选择你的烦恼来源
2. **滑动卡片** — 回答一系列"是/否"问题，像剥洋葱一样层层深入
3. **LLM 收敛** — AI 根据你的回答动态调整提问方向，逐步锁定核心痛点
4. **获取蓝图** — 输出痛点确诊、产品定义、技术栈推荐，以及一份**可直接复制给 Cursor / Claude Code / v0 的 Coding Agent 提示词**

## 技术栈

- **框架:** Next.js 16 (App Router)
- **语言:** TypeScript
- **样式:** Tailwind CSS
- **动画:** Framer Motion
- **大模型:** DeepSeek API (`deepseek-chat`)
- **部署:** Vercel

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 DeepSeek API Key

复制 `.env.example` 为 `.env.local`，填入你的 Key：

```bash
DEEPSEEK_API_KEY=sk-你的key
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

### 4. 部署到公网

将代码推送到 GitHub，连接 [Vercel](https://vercel.com)，在环境变量中设置 `DEEPSEEK_API_KEY`，一键部署。

## 项目结构

```
.
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # 问题生成接口
│   │   └── report/route.ts    # 报告生成接口
│   ├── layout.tsx
│   ├── page.tsx               # 页面阶段路由
│   └── globals.css
├── components/
│   ├── IceBreaker.tsx         # 阶段1：场景锚点选择
│   ├── SwipeCard.tsx          # 可拖拽的是/否卡片
│   ├── SwipeDeck.tsx          # 卡片堆叠容器 + 左右按钮
│   ├── ProgressIndicator.tsx  # 灯泡亮度 + 小草生长指示器
│   ├── Generating.tsx         # 灵感生成过渡动画
│   ├── ResultReport.tsx       # 报告展示 + 一键复制提示词
│   └── Toast.tsx              # 复制成功提示
├── hooks/
│   └── useConversation.tsx    # 全局对话状态管理
├── lib/
│   ├── types.ts               # 类型定义
│   ├── prompts.ts             # LLM System Prompt 模板
│   ├── deepseek.ts            # DeepSeek API 客户端
│   └── rate-limiter.ts        # IP 限流
└── public/
```

## 安全限流

- 提问接口：每个 IP 每小时 30 次
- 报告生成：每个 IP 每天 5 次
- 会话硬上限：每次最多 20 个问题

建议在 DeepSeek 控制台设置月度消费上限作为兜底。

## License

MIT
