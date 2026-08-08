"use client";

import { useEffect, useState } from "react";

interface Series {
  name: string;
  color: string;
  points: { date: string; score: number }[];
}

interface RatingChartProps {
  series: Series[];
  height?: number;
}

/**
 * График динамики рейтингов.
 * Две линии: народный рейтинг (teal) и профессиональный (navy) —
 * сравнение во времени напрямую показывает их расхождение.
 * Линии плавно «прорисовываются», точки интерактивны (ховер → значение).
 */
export default function RatingChart({ series, height = 160 }: RatingChartProps) {
  const [drawn, setDrawn] = useState(false);
  const [hover, setHover] = useState<{ s: number; i: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const W = 640;
  const H = height;
  const padX = 4;
  const padTop = 8;
  const padBottom = 24;
  const n = Math.max(...series.map((s) => s.points.length));

  const x = (i: number) => padX + (i / (n - 1)) * (W - padX * 2);
  const y = (score: number) => padTop + (1 - score / 100) * (H - padTop - padBottom);

  const labels = series[0].points
    .map((p, i) => ({ ...p, i }))
    .filter((_, idx) => idx % 4 === 0);

  return (
    <div>
      {/* Легенда серий */}
      <div style={{ display: "flex", gap: 18, marginBottom: 8, flexWrap: "wrap" }}>
        {series.map((s) => (
          <span key={s.name} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--text-2)" }}>
            <i style={{ width: 16, height: 3, borderRadius: 2, background: s.color, display: "inline-block" }} />
            {s.name}
          </span>
        ))}
      </div>

      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {/* Сетка */}
        {[25, 50, 75].map((lvl) => (
          <line key={lvl} x1={0} y1={y(lvl)} x2={W} y2={y(lvl)} stroke="#C7D2E0" strokeDasharray="4 4" />
        ))}

        {series.map((s, si) => {
          const line = s.points.map((p, i) => `${x(i)},${y(p.score)}`).join(" ");
          // Область под линией рисуем только для первой серии (народный рейтинг)
          const area = `${padX},${H - padBottom} ${line} ${W - padX},${H - padBottom}`;
          return (
            <g key={s.name}>
              {si === 0 && (
                <polygon
                  points={area}
                  fill={`${s.color}1A`}
                  style={{ opacity: drawn ? 1 : 0, transition: "opacity 1.2s var(--ease) 0.5s" }}
                />
              )}
              <polyline
                points={line}
                fill="none"
                stroke={s.color}
                strokeWidth={si === 0 ? 2.8 : 2.2}
                strokeDasharray={si === 1 ? "7 5" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: si === 0 ? 1400 : "7 5",
                  ...(si === 0
                    ? {
                        strokeDashoffset: drawn ? 0 : 1400,
                        transition: "stroke-dashoffset 1.6s var(--ease)",
                      }
                    : { opacity: drawn ? 1 : 0, transition: "opacity 1s var(--ease) 0.8s" }),
                }}
              />
              {/* Точки последней серии — конечные значения */}
              <circle
                cx={x(s.points.length - 1)}
                cy={y(s.points[s.points.length - 1].score)}
                r={4.5}
                fill={s.color}
                style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.4s var(--ease) 1.4s" }}
              />
              {/* Интерактивные невидимые точки для ховера */}
              {s.points.map((p, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(p.score)}
                  r={hover && hover.s === si && hover.i === i ? 5 : 3}
                  fill={hover && hover.s === si && hover.i === i ? s.color : "transparent"}
                  stroke={hover && hover.s === si && hover.i === i ? "#fff" : "none"}
                  style={{ transition: "all 0.2s var(--ease)", cursor: "pointer" }}
                  onMouseEnter={() => setHover({ s: si, i })}
                  onMouseLeave={() => setHover(null)}
                />
              ))}
            </g>
          );
        })}

        {/* Подписи месяцев */}
        {labels.map((p) => (
          <text key={p.date} x={x(p.i)} y={H - 6} fontSize={11} fill="#64748B">
            {p.date.slice(3)}
          </text>
        ))}
      </svg>

      {/* Всплывающее значение при наведении */}
      <div style={{ minHeight: 20, fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
        {hover
          ? `${series[hover.s].name}: ${series[hover.s].points[hover.i].score} баллов · ${series[hover.s].points[hover.i].date}`
          : "Наведите на точку, чтобы увидеть значение"}
      </div>
    </div>
  );
}
