"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  question: string;
  stackIndex: number;
  onSwipe: (direction: "left" | "right") => void;
}

export function SwipeCard({ question, stackIndex, onSwipe }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const isTop = stackIndex === 0;

  const handleDrag = useCallback(
    (_: any, info: { offset: { x: number } }) => {
      if (isTop) setDragX(info.offset.x);
    },
    [isTop]
  );

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (!isTop) return;
      if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) {
        setExiting(true);
        setExitDir("right");
        setTimeout(() => onSwipe("right"), 300);
      } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) {
        setExiting(true);
        setExitDir("left");
        setTimeout(() => onSwipe("left"), 300);
      }
      setDragX(0);
    },
    [isTop, onSwipe]
  );

  const rotate = isTop ? dragX * 0.05 : 0;
  const yesOpacity = isTop ? Math.min(1, Math.max(0, dragX / SWIPE_THRESHOLD)) : 0;
  const noOpacity = isTop ? Math.min(1, Math.max(0, -dragX / SWIPE_THRESHOLD)) : 0;

  const yOffset = stackIndex * 14;
  const s = 1 - stackIndex * 0.05;
  const o = 1 - stackIndex * 0.18;
  const shadow = stackIndex === 0
    ? "0 14px 40px -6px rgba(0,0,0,0.22), 0 4px 14px -2px rgba(0,0,0,0.10)"
    : stackIndex === 1
      ? "0 8px 24px -4px rgba(0,0,0,0.14)"
      : "0 4px 12px -4px rgba(0,0,0,0.08)";

  return (
    <motion.div
      key={`card-${stackIndex}`}
      drag={isTop ? "x" : false}
      dragElastic={0.85}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={isTop ? { cursor: "grabbing" } : undefined}
      initial={{ y: yOffset + 30, opacity: 0 }}
      animate={
        exiting
          ? { x: exitDir === "right" ? 500 : -500, opacity: 0, rotate: exitDir === "right" ? 20 : -20 }
          : { x: 0, y: yOffset, scale: s, opacity: o, rotate }
      }
      transition={
        exiting
          ? { duration: 0.3 }
          : { type: "spring", stiffness: 350, damping: 28 }
      }
      style={{ position: "absolute", width: "100%", zIndex: 10 - stackIndex }}
      className="touch-none select-none"
    >
      {/* 卡片本体 */}
      <div
        className="flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-white"
        style={{ boxShadow: shadow }}
      >
        {/* YES 叠层 */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center rounded-3xl bg-gradient-to-r from-emerald-100/95 to-transparent"
          style={{ opacity: yesOpacity }}
        >
          <span className="ml-10 text-4xl font-black text-emerald-600">YES</span>
        </div>

        {/* NO 叠层 */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-end rounded-3xl bg-gradient-to-l from-rose-100/95 to-transparent"
          style={{ opacity: noOpacity }}
        >
          <span className="mr-10 text-4xl font-black text-rose-500">NO</span>
        </div>

        {/* 内容 */}
        <span className="relative z-10 mb-4 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
          灵感向导的提问
        </span>
        <p className="relative z-10 max-w-[280px] text-center text-xl font-semibold leading-relaxed text-zinc-800">
          {question}
        </p>
      </div>
    </motion.div>
  );
}
