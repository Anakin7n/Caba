"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useConversation } from "@/hooks/useConversation";
import { Toast, useToast } from "./Toast";

export function ResultReport() {
  const { report, reset } = useConversation();
  const { toast, showToast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyPrompt = useCallback(async () => {
    if (!report?.codingAgentPrompt) return;
    try {
      await navigator.clipboard.writeText(report.codingAgentPrompt);
      showToast("✅ 提示词已复制，去粘贴给 Coding Agent 吧！");
    } catch {
      // fallback for older browsers / non-HTTPS
      showToast("复制失败，请手动选中文字复制");
    }
  }, [report, showToast]);

  if (!report) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-zinc-400">报告数据加载失败，请重试。</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-zinc-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pb-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-5xl">✨</span>
          <h1 className="mt-3 text-2xl font-bold text-zinc-900">
            你的灵感蓝图
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            经过 {""} 轮对话，灵感向导为你挖掘出了这个方向
          </p>
        </motion.div>
      </div>

      {/* Report Cards */}
      <div className="mx-auto max-w-sm space-y-4 px-4 pt-6">
        {/* 痛点确诊 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-rose-100 bg-white p-5"
        >
          <div className="mb-2 text-sm font-semibold text-rose-400">
            🎯 痛点确诊
          </div>
          <p className="text-base leading-relaxed text-zinc-700">
            {report.painPoint}
          </p>
        </motion.div>

        {/* 产品定义 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-amber-100 bg-white p-5"
        >
          <div className="mb-2 text-sm font-semibold text-amber-500">
            🚀 产品定义
          </div>
          <h2 className="mb-1 text-xl font-bold text-zinc-800">
            {report.productName}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            {report.productDescription}
          </p>
        </motion.div>

        {/* 技术栈推荐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-emerald-100 bg-white p-5"
        >
          <div className="mb-2 text-sm font-semibold text-emerald-500">
            🛠 推荐技术栈
          </div>
          <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
            {report.techStack}
          </p>
        </motion.div>

        {/* Coding Agent 提示词 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden rounded-2xl border border-indigo-200 bg-white"
        >
          <div className="flex items-center justify-between bg-indigo-50 px-5 py-3">
            <span className="text-sm font-semibold text-indigo-600">
              🔥 Coding Agent 提示词
            </span>
            <button
              onClick={handleCopyPrompt}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-indigo-600 active:scale-95"
            >
              一键复制
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-5">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 font-sans break-words">
              {report.codingAgentPrompt}
            </pre>
          </div>
        </motion.div>

        {/* 重新开始 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4 text-center"
        >
          <button
            onClick={reset}
            className="rounded-full border-2 border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-700 active:scale-95"
          >
            再来一次 🔄
          </button>
        </motion.div>
      </div>

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
