"use client";

import { useEffect, useState } from "react";
import { scoreCssColor } from "@/lib/types";

interface ScoreRingProps {
  /** Народный рейтинг: процент голосов «за» (0–100) */
  score: number;
  /** Общее число подтверждённых голосов */
  votesCount: number;
}

/**
 * Кольцевой индикатор Народного рейтинга (процент голосов «за»).
 * Дуга анимированно «рисуется» после монтирования (плавный переход),
 * цвет зависит от балла по порогам ТЗ.
 */
export default function ScoreRing({ score, votesCount }: ScoreRingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Задержка нужна, чтобы браузер зафиксировал начальное состояние
    // conic-gradient и CSS-transition сработал плавно.
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const pct = mounted ? score : 0;
  const color = scoreCssColor(score);

  return (
    <div className="p-score">
      <div
        className="score-circle"
        style={{
          background: `conic-gradient(${color} 0 ${pct}%, rgba(255,255,255,0.14) ${pct}% 100%)`,
        }}
      >
        <div className="score-inner">
          <div className="score-num" style={{ color }}>
            {score}%
          </div>
          <div className="score-lbl">«за»</div>
        </div>
      </div>
      <div className="votes-lbl">
        Народный рейтинг · {votesCount.toLocaleString("ru-RU")} голосов
      </div>
    </div>
  );
}
