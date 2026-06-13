"use client";

import { motion } from "framer-motion";

export function Generating() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-8">
      {/* 灯泡爆发动画 */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1.3, 1],
          opacity: 1,
        }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <motion.span
          className="text-7xl"
          animate={{
            filter: [
              "drop-shadow(0 0 0px rgba(251,191,36,0))",
              "drop-shadow(0 0 20px rgba(251,191,36,0.8))",
              "drop-shadow(0 0 30px rgba(251,191,36,0.6))",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
        >
          💡
        </motion.span>
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-zinc-800">
        灵感降临中…
      </h2>
      <p className="text-center text-sm leading-relaxed text-zinc-500">
        灵感向导正在分析你的回答，
        <br />
        为你生成专属的产品蓝图和开发提示词。
      </p>

      {/* 加载进度条 */}
      <motion.div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      </motion.div>

      {/* 随机鼓励语 */}
      <motion.p
        className="mt-6 text-xs text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        好点子往往藏在最深的地方…
      </motion.p>
    </div>
  );
}
