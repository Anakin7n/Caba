"use client";

import { useState, useCallback } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  }, []);

  return { toast, showToast };
}

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="rounded-full bg-zinc-800 px-5 py-2.5 text-sm text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
