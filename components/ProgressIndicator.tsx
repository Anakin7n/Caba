"use client";

import { motion } from "framer-motion";
import { useConversation } from "@/hooks/useConversation";

interface ProgressIndicatorProps {
  /** 当前已回答问题数 */
  answered: number;
  /** 最多问题数（硬上限） */
  max: number;
}

export function ProgressIndicator({ answered, max }: ProgressIndicatorProps) {
  // 灯泡亮度：0 → 1，随回答数递增
  const brightness = Math.min(answered / 12, 1);
  // 小草高度比例：0 → 1，随回答数递增
  const grassGrowth = Math.min(answered / 15, 1);

  return (
    <div className="flex w-full max-w-sm items-center justify-between px-2">
      {/* 灯泡 */}
      <div className="flex flex-col items-center gap-1">
        <motion.span
          className="text-3xl"
          animate={{
            filter: `drop-shadow(0 0 ${brightness * 12}px rgba(251, 191, 36, ${brightness}))`,
            scale: 0.8 + brightness * 0.4,
          }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          💡
        </motion.span>
        <span className="text-[10px] text-zinc-400">灵感亮度</span>
      </div>

      {/* 问题进度点 */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: Math.min(max, 15) }, (_, i) => {
          const filled = i < answered;
          const current = i === answered;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: current ? 1.4 : filled ? 1 : 0.8,
                backgroundColor: current
                  ? "#fbbf24"
                  : filled
                    ? "#fde68a"
                    : "#e5e7eb",
              }}
              className="h-2 w-2 rounded-full"
            />
          );
        })}
      </div>

      {/* 小草 */}
      <div className="flex flex-col items-center gap-1">
        <motion.span
          className="text-2xl"
          animate={{
            scaleY: 0.5 + grassGrowth * 0.7,
            scaleX: 0.8 + grassGrowth * 0.3,
          }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          🌱
        </motion.span>
        <span className="text-[10px] text-zinc-400">思考生长</span>
      </div>
    </div>
  );
}
