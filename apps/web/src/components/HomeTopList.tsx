"use client";

import { useState } from "react";
import type { Deputy, DeputyLevel } from "@/lib/types";
import { LEVEL_SHORT } from "@/lib/types";
import DeputyRow from "./DeputyRow";

type Tab = "all" | DeputyLevel;

interface HomeTopListProps {
  deputies: Deputy[];
  counts: Record<DeputyLevel, number>;
}

/** Топ депутатов по народному рейтингу с переключателем уровней власти. */
export default function HomeTopList({ deputies, counts }: HomeTopListProps) {
  const [tab, setTab] = useState<Tab>("all");

  const sorted = [...deputies].sort((a, b) => b.overallScore - a.overallScore);
  const list = (tab === "all" ? sorted : sorted.filter((d) => d.level === tab)).slice(0, 5);

  const tabs: { key: Tab; label: string; cnt: number }[] = [
    { key: "all", label: "Все уровни", cnt: deputies.length },
    { key: "federal", label: LEVEL_SHORT.federal, cnt: counts.federal },
    { key: "regional", label: LEVEL_SHORT.regional, cnt: counts.regional },
    { key: "municipal", label: LEVEL_SHORT.municipal, cnt: counts.municipal },
  ];

  return (
    <div className="card lift anim d1">
      <div className="sec-head">
        <h2>★ Топ по народному рейтингу</h2>
        <a className="all" href="/deputies">
          Весь список →
        </a>
      </div>
      <div className="seg">
        {tabs.map((t) => (
          <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => setTab(t.key)}>
            {t.label} <span className="cnt">{t.cnt}&nbsp;{t.cnt === 1 ? "депутат" : "деп."}</span>
          </button>
        ))}
      </div>
      {list.map((d) => (
        <DeputyRow key={d.id} d={d} />
      ))}
    </div>
  );
}
