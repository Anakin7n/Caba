import { NextRequest, NextResponse } from "next/server";
import { getNextQuestion } from "@/lib/deepseek";
import { buildQuestionSystemPrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limiter";
import type { QAPair } from "@/lib/types";

/** 获取客户端 IP */
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  // 限流检查：每个 IP 每小时最多 30 次提问
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `请求太频繁，请在 ${Math.ceil(limit.resetInSeconds / 60)} 分钟后再试。`,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(limit.resetInSeconds),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { anchor, history } = body as {
      anchor: string;
      history: QAPair[];
    };

    if (!anchor) {
      return NextResponse.json(
        { error: "缺少 anchor 参数" },
        { status: 400 }
      );
    }

    const systemPrompt = buildQuestionSystemPrompt(anchor, history ?? []);
    const result = await getNextQuestion(systemPrompt);

    if (result === "[CONVERGE]") {
      return NextResponse.json({ converged: true });
    }

    return NextResponse.json(
      { question: result, converged: false },
      {
        headers: {
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    console.error("/api/chat 错误:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
