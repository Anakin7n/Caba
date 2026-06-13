import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/deepseek";
import { buildReportSystemPrompt } from "@/lib/prompts";
import { checkReportLimit } from "@/lib/rate-limiter";
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

  // 报告生成限流更严格：每个 IP 每天 5 次
  const limit = checkReportLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `今日报告生成次数已用完，请明天再试（每日上限 5 次）。`,
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

    if (!anchor || !history?.length) {
      return NextResponse.json(
        { error: "缺少 anchor 或 history 参数" },
        { status: 400 }
      );
    }

    const systemPrompt = buildReportSystemPrompt(anchor, history);
    const report = await generateReport(systemPrompt);

    return NextResponse.json(report, {
      headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    console.error("/api/report 错误:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
