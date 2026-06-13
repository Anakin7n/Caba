"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type { Stage, QAPair, ReportResult } from "@/lib/types";

interface ConversationState {
  stage: Stage;
  anchor: string;
  currentQuestion: string | null;
  history: QAPair[];
  report: ReportResult | null;
  isLoading: boolean;
  error: string | null;
}

interface ConversationActions {
  /** 选择场景锚点，自动获取第一个问题 */
  selectAnchor: (anchor: string) => Promise<void>;
  /** 回答当前问题（true=右滑/是, false=左滑/否），自动获取下一个问题或收敛 */
  answer: (answer: boolean) => Promise<void>;
  /** 重置到初始状态 */
  reset: () => void;
}

type ConversationContextType = ConversationState & ConversationActions;

const ConversationContext = createContext<ConversationContextType | null>(null);

const INITIAL_STATE: ConversationState = {
  stage: "icebreaker",
  anchor: "",
  currentQuestion: null,
  history: [],
  report: null,
  isLoading: false,
  error: null,
};

/** 硬上限：最多提问次数，防止无限循环 */
const MAX_QUESTIONS = 20;

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConversationState>(INITIAL_STATE);

  const selectAnchor = useCallback(async (anchor: string) => {
    setState((prev) => ({
      ...prev,
      anchor,
      stage: "swiping",
      isLoading: true,
      error: null,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anchor, history: [] }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "请求失败");

      setState((prev) => ({
        ...prev,
        currentQuestion: data.question,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "获取问题失败",
        isLoading: false,
      }));
    }
  }, []);

  const answer = useCallback(
    async (answer: boolean) => {
      const { currentQuestion, history, anchor } = state;
      if (!currentQuestion) return;

      const newHistory: QAPair[] = [
        ...history,
        { question: currentQuestion, answer },
      ];

      // 硬上限触发收敛
      if (newHistory.length >= MAX_QUESTIONS) {
        setState((prev) => ({
          ...prev,
          history: newHistory,
          currentQuestion: null,
          stage: "generating",
          isLoading: true,
        }));

        try {
          const res = await fetch("/api/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anchor, history: newHistory }),
          });
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "生成报告失败");

          setState((prev) => ({
            ...prev,
            report: data,
            stage: "result",
            isLoading: false,
          }));
        } catch (err) {
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : "生成报告失败",
            isLoading: false,
          }));
        }
        return;
      }

      // 先更新 history，准备获取下一个问题
      setState((prev) => ({
        ...prev,
        history: newHistory,
        currentQuestion: null,
        isLoading: true,
      }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anchor, history: newHistory }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "请求失败");

        // LLM 判断收敛
        if (data.converged) {
          setState((prev) => ({
            ...prev,
            stage: "generating",
          }));

          const reportRes = await fetch("/api/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anchor, history: newHistory }),
          });
          const reportData = await reportRes.json();

          if (!reportRes.ok)
            throw new Error(reportData.error || "生成报告失败");

          setState((prev) => ({
            ...prev,
            report: reportData,
            stage: "result",
            isLoading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            currentQuestion: data.question,
            isLoading: false,
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "请求失败",
          isLoading: false,
        }));
      }
    },
    [state]
  );

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return (
    <ConversationContext.Provider
      value={{ ...state, selectAnchor, answer, reset }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation(): ConversationContextType {
  const ctx = useContext(ConversationContext);
  if (!ctx) {
    throw new Error(
      "useConversation 必须在 ConversationProvider 内部使用"
    );
  }
  return ctx;
}
