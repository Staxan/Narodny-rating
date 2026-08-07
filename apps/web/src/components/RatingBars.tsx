"use client";

import { useEffect, useState } from "react";
import type { RatingBlock } from "@/lib/types";
import { scoreCssColor } from "@/lib/types";

interface RatingBarsProps {
  blocks: RatingBlock[];
}

/**
 * Блоки рейтинга с плавным заполнением шкал.
 * При монтировании ширина полос анимированно растёт от 0 до значения —
 * тот самый «современный» эффект оживающих данных.
 */
export default function RatingBars({ blocks }: RatingBarsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {blocks.map((b, i) => (
        <div className="blk" key={b.code}>
          <div className="blk-name">
            {b.name} <span className="w">· вес {b.weight}%</span>
          </div>
          <div className="bar">
            {b.score !== null && (
              <i
                style={{
                  width: mounted ? `${b.score}%` : "0%",
                  background: `linear-gradient(90deg, ${scoreCssColor(b.score)}CC, ${scoreCssColor(b.score)})`,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            )}
          </div>
          <div className="blk-val" style={b.score !== null ? { color: scoreCssColor(b.score) } : undefined}>
            {b.score !== null ? b.score : <span className="nodata">нет данных</span>}
          </div>
        </div>
      ))}
    </>
  );
}
