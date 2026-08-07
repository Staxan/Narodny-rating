"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Максимальная ширина содержимого */
  maxWidth?: number;
}

/**
 * Базовое модальное окно: затемнённый фон, плавное появление,
 * закрытие по Escape и клику на подложку.
 */
export default function Modal({ open, onClose, children, maxWidth = 560 }: ModalProps) {
  // Закрытие по Escape
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
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-panel anim"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
