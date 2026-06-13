// 应用的核心类型定义

/** 应用所处的阶段 */
export type Stage = "icebreaker" | "swiping" | "generating" | "result";

/** 破冰场景锚点 */
export interface AnchorOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

/** 单轮问答记录 */
export interface QAPair {
  question: string;
  answer: boolean; // true = 右滑（是）, false = 左滑（否）
}

/** DeepSeek API 消息格式 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** LLM 生成的最终报告 */
export interface ReportResult {
  painPoint: string;
  productName: string;
  productDescription: string;
  techStack: string;
  codingAgentPrompt: string;
}
