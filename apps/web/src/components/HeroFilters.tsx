"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Deputy } from "@/lib/types";

interface HeroFiltersProps {
  deputies: Deputy[];
}

const LEVEL_OPTIONS = [
  { v: "", label: "Все" },
  { v: "federal", label: "Госдума" },
  { v: "regional", label: "Региональные" },
  { v: "municipal", label: "Муниципальные" },
];

const RATING_OPTIONS = [
  { v: "", label: "Любой" },
  { v: "high", label: "Высокий (70+)" },
  { v: "mid", label: "Средний (40–69)" },
  { v: "low", label: "Низкий (ниже 40)" },
];

/**
 * Hero-блок главной: поиск и рабочие фильтры.
 * Выбор фильтра ведёт в список депутатов (/deputies) с параметрами в URL —
 * там фильтры применяются автоматически.
 */
export default function HeroFilters({ deputies }: HeroFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [region, setRegion] = useState("");
  const [faction, setFaction] = useState("");
  const [rating, setRating] = useState("");

  const regions = useMemo(
    () => Array.from(new Set(deputies.map((d) => d.region))).sort((a, b) => a.localeCompare(b, "ru")),
    [deputies]
  );
  const factions = useMemo(
    () => Array.from(new Set(deputies.map((d) => d.faction))).sort((a, b) => a.localeCompare(b, "ru")),
    [deputies]
  );

  function goToDeputies(extra?: Record<string, string>) {
    const params = new URLSearchParams();
    const q = extra?.q ?? query.trim();
    const lvl = extra?.level ?? level;
    const reg = extra?.region ?? region;
    const fac = extra?.faction ?? faction;
    const rat = extra?.rating ?? rating;
    if (q) params.set("q", q);
    if (lvl) params.set("level", lvl);
    if (reg) params.set("region", reg);
    if (fac) params.set("faction", fac);
    if (rat) params.set("rating", rat);
    router.push(`/deputies${params.toString() ? `?${params}` : ""}`);
  }

  // Переход сразу при выборе фильтра (без нажатия «Найти»)
  function onPick(key: string, value: string) {
    if (key === "level") setLevel(value);
    if (key === "region") setRegion(value);
    if (key === "faction") setFaction(value);
    if (key === "rating") setRating(value);
    goToDeputies({ [key]: value });
  }

  const chipStyle: React.CSSProperties = {
    color: "var(--text)",
    background: "var(--bg)",
    fontFamily: "inherit",
    fontSize: 13.5,
    cursor: "pointer",
    border: "1px solid var(--border)",
    borderRadius: 22,
    padding: "8px 15px",
    outline: "none",
    transition: "border-color 0.25s var(--ease), box-shadow 0.25s var(--ease)",
  };

  return (
    <>
      <div className="search-row anim d4">
        <div className="search-box">
          <span className="ic">⌕</span>
          <input
            placeholder="Поиск по ФИО депутата или номеру округа…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToDeputies()}
          />
        </div>
        <button className="btn btn-lg" onClick={() => goToDeputies()}>
          Найти
        </button>
      </div>
      <div className="chips anim d5">
        <select style={chipStyle} value={level} onChange={(e) => onPick("level", e.target.value)}>
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.v} value={o.v}>Уровень: {o.label}</option>
          ))}
        </select>
        <select style={chipStyle} value={region} onChange={(e) => onPick("region", e.target.value)}>
          <option value="">Регион: Все</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select style={chipStyle} value={faction} onChange={(e) => onPick("faction", e.target.value)}>
          <option value="">Фракция: Все</option>
          {factions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select style={chipStyle} value={rating} onChange={(e) => onPick("rating", e.target.value)}>
          {RATING_OPTIONS.map((o) => (
            <option key={o.v} value={o.v}>Рейтинг: {o.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
