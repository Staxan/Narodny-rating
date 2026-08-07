"use client";

import { useEffect, useState } from "react";

interface RatingChartProps {
  points: { date: string; score: number }[];
  height?: number;
}

/**
 * Линейный график динамики рейтинга.
 * Линия плавно «прорисовывается» при появлении на экране
 * (SVG stroke-dasharray анимация) — современный презентационный эффект.
 */
export default function RatingChart({ points, height = 150 }: RatingChartProps) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const W = 640;
  const H = height;
  const padX = 4;
  const padTop = 8;
  const padBottom = 24;

  // Перевод баллов (0–100) в координаты SVG
  const x = (i: number) => padX + (i / (points.length - 1)) * (W - padX * 2);
  const y = (score: number) =>
    padTop + (1 - score / 100) * (H - padTop - padBottom);

  const line = points.map((p, i) => `${x(i)},${y(p.score)}`).join(" ");
  // Замкнутая область под линией для мягкой подложки
  const area = `${padX},${H - padBottom} ${line} ${W - padX},${H - padBottom}`;

  const labels = points
    .map((p, i) => ({ ...p, i }))
    .filter((_, idx) => idx % 4 === 0);

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {/* Сетка */}
      {[25, 50, 75].map((lvl) => (
        <line
          key={lvl}
          x1={0}
          y1={y(lvl)}
          x2={W}
          y2={y(lvl)}
          stroke="#E3E9F2"
          strokeDasharray="4 4"
        />
      ))}
      {/* Область под линией */}
      <polygon
        points={area}
        fill="rgba(13,148,136,0.10)"
        style={{ opacity: drawn ? 1 : 0, transition: "opacity 1.2s var(--ease) 0.5s" }}
      />
      {/* Основная линия с анимацией прорисовки */}
      <polyline
        points={line}
        fill="none"
        stroke="#0D9488"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1400,
          strokeDashoffset: drawn ? 0 : 1400,
          transition: "stroke-dashoffset 1.6s var(--ease)",
        }}
      />
      {/* Точка последнего значения */}
      <circle
        cx={x(points.length - 1)}
        cy={y(points[points.length - 1].score)}
        r={4.5}
        fill="#0D9488"
        style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.4s var(--ease) 1.4s" }}
      />
      {/* Подписи месяцев */}
      {labels.map((p) => (
        <text key={p.date} x={x(p.i)} y={H - 6} fontSize={11} fill="#64748B">
          {p.date.slice(3)}
        </text>
      ))}
    </svg>
  );
}
