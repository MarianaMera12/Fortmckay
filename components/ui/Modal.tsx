"use client";

import { useEffect, type ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, subtitle, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-auto rounded-[18px] bg-white p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 className="text-[22px] font-medium">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-xl text-black/40">
            ✕
          </button>
        </div>
        {subtitle && <p className="mb-5 text-sm text-black/50">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
