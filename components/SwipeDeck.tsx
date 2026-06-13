"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard } from "./SwipeCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { useConversation } from "@/hooks/useConversation";

const MAX_QUESTIONS = 20;

export function SwipeDeck() {
  const { currentQuestion, history, isLoading, error, answer } =
    useConversation();
  const [animatingOut, setAnimatingOut] = useState(false);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (animatingOut) return;
      setAnimatingOut(true);
      setTimeout(() => {
        answer(direction === "right");
        setAnimatingOut(false);
      }, 300);
    },
    [answer, animatingOut]
  );

  return (
    <div className="flex min-h-svh flex-col items-center justify-between py-10">
      {/* 顶部进度 */}
      <div className="w-full px-4">
        <ProgressIndicator answered={history.length} max={MAX_QUESTIONS} />
      </div>

      {/* 卡片区域 */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 w-full">
        <div className="relative w-full max-w-sm" style={{ height: 340 }}>
          <AnimatePresence mode="wait">
            {/* Loading */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 w-full flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-[0_14px_40px_-6px_rgba(0,0,0,0.22)]"
                style={{ minHeight: 280, zIndex: 20 }}
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full bg-amber-400"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-400">灵感向导正在思考…</p>
              </motion.div>
            )}

            {/* 卡片堆叠 */}
            {!isLoading && currentQuestion && (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute top-0 w-full"
              >
                {/* 第三层（最远） */}
                <div
                  className="absolute w-full rounded-3xl bg-white"
                  style={{
                    top: 28,
                    height: 280,
                    boxShadow: "0 4px 12px -4px rgba(0,0,0,0.08)",
                    opacity: 0.64,
                    transform: "scale(0.90)",
                    transformOrigin: "top center",
                  }}
                >
                  <div className="flex h-full items-center justify-center text-3xl text-zinc-300">？</div>
                </div>

                {/* 第二层（中间） */}
                <div
                  className="absolute w-full rounded-3xl bg-white"
                  style={{
                    top: 14,
                    height: 280,
                    boxShadow: "0 8px 24px -4px rgba(0,0,0,0.14)",
                    opacity: 0.82,
                    transform: "scale(0.95)",
                    transformOrigin: "top center",
                  }}
                >
                  <div className="flex h-full items-center justify-center text-3xl text-zinc-300">？</div>
                </div>

                {/* 顶层（可交互） */}
                <SwipeCard
                  question={currentQuestion}
                  stackIndex={0}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex w-full max-w-sm items-center justify-between px-6">
        <button
          onClick={() => handleSwipe("left")}
          disabled={isLoading || animatingOut || !currentQuestion}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-200 bg-white text-rose-400 text-2xl shadow-md transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow-lg active:scale-95 disabled:opacity-30"
        >
          ✕
        </button>
        <span className="text-xs font-medium text-zinc-300">
          {history.length + 1}/{MAX_QUESTIONS}
        </span>
        <button
          onClick={() => handleSwipe("right")}
          disabled={isLoading || animatingOut || !currentQuestion}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-200 bg-white text-emerald-500 text-2xl shadow-md transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg active:scale-95 disabled:opacity-30"
        >
          ✓
        </button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
