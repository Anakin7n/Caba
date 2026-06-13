"use client";

import { motion } from "framer-motion";
import { ANCHOR_OPTIONS } from "@/lib/prompts";
import { useConversation } from "@/hooks/useConversation";

export function IceBreaker() {
  const { selectAnchor, isLoading } = useConversation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900">
          Brightness
        </h1>
        <p className="text-base text-zinc-500">
          灵感不会凭空出现，但可以被引导出来。
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          选一个方向，让我们开始。
        </p>
      </motion.div>

      {/* Anchor Cards */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        {ANCHOR_OPTIONS.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            onClick={() => selectAnchor(option.description)}
            disabled={isLoading}
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:border-amber-300 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
              {option.emoji}
            </span>
            <div>
              <div className="text-base font-semibold text-zinc-800">
                {option.label}
              </div>
              <div className="mt-0.5 text-sm text-zinc-500">
                {option.description}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {isLoading && (
        <p className="mt-8 text-sm text-zinc-400">正在准备第一个问题…</p>
      )}
    </div>
  );
}
