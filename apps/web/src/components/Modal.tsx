"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
 *
 * ВАЖНО: окно рендерится через портал в document.body. Иначе CSS-анимации
 * родителей (transform из fade-up) ломают position: fixed, и окно
 * «встраивается» в поток страницы вместо того, чтобы быть поверх неё.
 */
export default function Modal({ open, onClose, children, maxWidth = 560 }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Портал доступен только в браузере (защита от SSR)
  useEffect(() => setMounted(true), []);

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel anim" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
