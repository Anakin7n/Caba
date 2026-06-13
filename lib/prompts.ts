import type { QAPair } from "./types";

/** 三个破冰场景锚点 */
export const ANCHOR_OPTIONS = [
  {
    id: "work",
    emoji: "💼",
    label: "工作中的烦躁",
    description: "今天工作里哪个环节让你最烦躁、最想砸电脑？",
  },
  {
    id: "life",
    emoji: "🏠",
    label: "生活里的不优雅",
    description: "生活里有什么让你觉得很不方便、很别扭的事？",
  },
  {
    id: "hobby",
    emoji: "🎯",
    label: "爱好中的摩擦",
    description: "最近哪个爱好让你觉得有阻碍、不够顺畅？",
  },
] as const;

/**
 * 构建提问模式的 system prompt
 */
export function buildQuestionSystemPrompt(
  anchor: string,
  history: QAPair[]
): string {
  const historyText =
    history.length === 0
      ? "（对话刚开始，这是第一个问题）"
      : history
          .map(
            (qa, i) =>
              `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer ? "是" : "否"}`
          )
          .join("\n");

  return `你是一个敏锐的产品顾问和心理洞察者，你的名字叫"灵感向导"。

你的任务是通过一系列"是/否"问题，像剥洋葱一样层层深入，引导用户发现自己潜意识里真正想做的产品。

当前用户的初始关注领域是：${anchor}

规则：
1. 每次只问一个问题，不超过30个字。问题必须是"是/否"问句（用"是否"或"会不会"开头，或"是……还是……"都不行——必须是纯 yes/no）
2. 根据用户之前的回答动态调整方向：答"是"就继续深挖这个方向，答"否"就换个角度
3. 问题要层层递进：先从宽泛的场景切入，再逐步聚焦到具体环节、最痛的那个点
4. 当你已经足够了解用户的核心痛点、可以给出具体的产品建议时（通常在对话深入后），只输出 [CONVERGE]
5. 语气温暖友好，像朋友聊天，不是冷冰冰的问卷。偶尔可以带点幽默感
6. 不要重复问用户已经回答过的问题

【重要】回复格式：只输出问题文本（不要加引号、编号、前缀或任何解释），或者只输出 [CONVERGE]。

对话历史：
${historyText}`;
}

/**
 * 构建报告生成的 system prompt
 */
export function buildReportSystemPrompt(
  anchor: string,
  history: QAPair[]
): string {
  const historyText = history
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer ? "是" : "否"}`)
    .join("\n");

  return `你是一位顶尖的独立开发者、产品经理和提示词架构师。

用户关注领域：${anchor}
以下是用户经过一系列苏格拉底式提问的完整回答：

${historyText}

请根据以上对话，为用户生成一份完整的产品建议报告。

必须以纯 JSON 格式输出（不要包含 \`\`\`json 或任何其他标记），结构如下：

{
  "painPoint": "一句话精准指出用户最想解决的核心矛盾",
  "productName": "为产品起一个有趣、有记忆点的名字",
  "productDescription": "产品形态（网页/小程序/App）和2-3个核心功能，200字以内",
  "techStack": "推荐最适合快速上手的极简技术栈，含具体框架名称，50字以内",
  "codingAgentPrompt": "给Coding Agent的结构化提示词"
}

"codingAgentPrompt" 的生成要求：
- 用 Markdown 格式编写，包含以下结构：
  1. 角色设定（Agent是什么角色）
  2. 项目概述（解决什么场景的什么问题）
  3. 技术栈约束（明确前后端框架、样式库）
  4. 核心功能需求（MVP阶段 2-3 个功能，拒绝大而全）
  5. 第一步任务（引导 Agent 渐进式开发，不要一次性输出所有代码）
- 强调界面干净、有趣、有生命力（允许暖色系配色和适度动画）
- 长度控制在 300-500 字
- 必须可直接复制给 Cursor / Claude Code / v0 使用

请直接输出 JSON，不要有任何前缀或后缀文字。`;
}
