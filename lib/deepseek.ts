import type { ChatMessage, ReportResult } from "./types";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
const DEEPSEEK_MODEL = "deepseek-chat";

function getApiKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key === "sk-placeholder") {
    throw new Error("DEEPSEEK_API_KEY 未配置，请在 .env.local 中设置");
  }
  return key;
}

/**
 * 通用 DeepSeek Chat 调用
 */
async function callDeepSeek(
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number
): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API 错误 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek API 返回了空内容");
  }

  return content.trim();
}

/**
 * 提问模式：根据对话历史生成下一个问题或 [CONVERGE]
 */
export async function getNextQuestion(
  systemPrompt: string
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "请生成下一个问题（或 [CONVERGE]）。" },
  ];

  return callDeepSeek(messages, 100, 0.7);
}

/**
 * 报告模式：根据完整对话历史生成最终报告
 */
export async function generateReport(
  systemPrompt: string
): Promise<ReportResult> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "请生成完整的产品建议报告（JSON格式）。" },
  ];

  const raw = await callDeepSeek(messages, 2000, 0.8);

  // 容错：去掉可能的 markdown 代码块标记
  let jsonStr = raw;
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    jsonStr = match[0];
  }

  try {
    const result: ReportResult = JSON.parse(jsonStr);
    // 校验必填字段
    const required: (keyof ReportResult)[] = [
      "painPoint",
      "productName",
      "productDescription",
      "techStack",
      "codingAgentPrompt",
    ];
    for (const field of required) {
      if (!result[field]) {
        throw new Error(`报告缺少必填字段: ${field}`);
      }
    }
    return result;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`报告 JSON 解析失败。原始内容: ${raw.slice(0, 200)}...`);
    }
    throw err;
  }
}
