"use client";

import { useMemo, useState } from "react";
import type { Deputy, DeputyLevel } from "@/lib/types";
import { LEVEL_SHORT } from "@/lib/types";
import DeputyRow from "@/components/DeputyRow";

type LevelFilter = "all" | DeputyLevel;
type SortKey = "rating" | "votes" | "name";

interface DeputyListClientProps {
  deputies: Deputy[];
}

/**
 * Список депутатов с фильтрами и поиском.
 * Этап 1: фильтрация по мок-данным на клиенте; позже — параметры запросов к API.
 */
export default function DeputyListClient({ deputies }: DeputyListClientProps) {
  const [level, setLevel] = useState<LevelFilter>("all");
  const [region, setRegion] = useState<string>("all");
  const [faction, setFaction] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");

  const regions = useMemo(
    () => Array.from(new Set(deputies.map((d) => d.region))).sort((a, b) => a.localeCompare(b, "ru")),
    [deputies]
  );
  const factions = useMemo(
    () => Array.from(new Set(deputies.map((d) => d.faction))).sort((a, b) => a.localeCompare(b, "ru")),
    [deputies]
  );

  const list = useMemo(() => {
    let res = deputies.filter((d) => {
      if (level !== "all" && d.level !== level) return false;
      if (region !== "all" && d.region !== region) return false;
      if (faction !== "all" && d.faction !== faction) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${d.fullName} ${d.position} ${d.district ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    switch (sort) {
      case "rating":
        res = res.sort((a, b) => b.overallScore - a.overallScore);
        break;
      case "votes":
        res = res.sort((a, b) => b.votesCount - a.votesCount);
        break;
      case "name":
        res = res.sort((a, b) => a.fullName.localeCompare(b.fullName, "ru"));
        break;
    }
    return res;
  }, [deputies, level, region, faction, query, sort]);

  const levelTabs: { key: LevelFilter; label: string }[] = [
    { key: "all", label: "Все уровни" },
    { key: "federal", label: LEVEL_SHORT.federal },
    { key: "regional", label: LEVEL_SHORT.regional },
    { key: "municipal", label: LEVEL_SHORT.municipal },
  ];

  return (
    <div className="wrap">
      <div className="crumbs anim d1">
        <b>Депутаты</b> · найдено: {list.length}
      </div>

      <div className="card anim d2 mt" style={{ marginTop: 12 }}>
        {/* Поиск */}
        <div className="search-box" style={{ boxShadow: "none", border: "1px solid var(--border)", marginBottom: 14 }}>
          <span className="ic">⌕</span>
          <input
            placeholder="Поиск по ФИО, должности или округу…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Переключатель уровней */}
        <div className="seg">
          {levelTabs.map((t) => (
            <button key={t.key} className={level === t.key ? "on" : ""} onClick={() => setLevel(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Фильтры */}
        <div className="chips" style={{ marginTop: 0 }}>
          <select
            className="chip"
            style={{ color: "var(--text)", background: "var(--bg)", fontFamily: "inherit", cursor: "pointer" }}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="all">Регион: Все</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            className="chip"
            style={{ color: "var(--text)", background: "var(--bg)", fontFamily: "inherit", cursor: "pointer" }}
            value={faction}
            onChange={(e) => setFaction(e.target.value)}
          >
            <option value="all">Фракция: Все</option>
            {factions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            className="chip"
            style={{ color: "var(--text)", background: "var(--bg)", fontFamily: "inherit", cursor: "pointer" }}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="rating">Сортировка: по рейтингу</option>
            <option value="votes">Сортировка: по числу голосов</option>
            <option value="name">Сортировка: по алфавиту</option>
          </select>
        </div>

        {/* Результаты */}
        <div style={{ marginTop: 16 }}>
          {list.map((d) => (
            <DeputyRow key={d.id} d={d} />
          ))}
          {list.length === 0 && (
            <div style={{ padding: "30px 0", color: "var(--text-2)", textAlign: "center" }}>
              По заданным условиям депутаты не найдены. Попробуйте изменить фильтры.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
