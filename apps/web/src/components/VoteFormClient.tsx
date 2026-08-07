"use client";

import { useMemo, useState } from "react";
import type { Deputy, PeopleChoice } from "@/lib/types";
import Avatar from "@/components/Avatar";

type Step = "deputy" | "choice" | "confirm";

interface VoteFormClientProps {
  deputies: Deputy[];
}

/**
 * Страница народного голосования: выбор депутата → За / Против / Воздержался
 * → подтверждение через Telegram-бота.
 * Этап 1: UX-цикл без реальной записи голоса (подключается с бэкендом).
 */
export default function VoteFormClient({ deputies }: VoteFormClientProps) {
  const [step, setStep] = useState<Step>("deputy");
  const [deputyId, setDeputyId] = useState("");
  const [choice, setChoice] = useState<PeopleChoice | null>(null);
  const [mockToken, setMockToken] = useState("");

  const deputy = useMemo(() => deputies.find((d) => d.id === deputyId), [deputies, deputyId]);

  function pick(c: PeopleChoice) {
    setChoice(c);
    const token = Array.from({ length: 24 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"[Math.floor(Math.random() * 57)]
    ).join("");
    setMockToken(token);
    setStep("confirm");
  }

  const CHOICES: { v: PeopleChoice; label: string; sub: string; bg: string }[] = [
    { v: "for", label: "За", sub: "Поддерживаю работу депутата", bg: "linear-gradient(180deg, #34D399, #10B981)" },
    { v: "against", label: "Против", sub: "Не поддерживаю работу депутата", bg: "linear-gradient(180deg, #F87171, #EF4444)" },
    { v: "abstain", label: "Воздержался", sub: "Не могу оценить работу", bg: "linear-gradient(180deg, #CBD5E1, #94A3B8)" },
  ];

  /* ---------- Шаг 1: выбор депутата ---------- */
  if (step === "deputy") {
    return (
      <div className="card anim d2" style={{ marginTop: 14 }}>
        <h2>1. Кого вы хотите оценить?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {deputies.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDeputyId(d.id);
                setStep("choice");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all 0.25s var(--ease)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <Avatar d={d} />
              <span style={{ flex: 1 }}>
                <span style={{ fontWeight: 650 }}>{d.fullName}</span>
                <br />
                <span style={{ color: "var(--text-2)", fontSize: 13 }}>{d.position}</span>
              </span>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>Выбрать →</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Шаг 2: За / Против / Воздержался ---------- */
  if (step === "choice" && deputy) {
    return (
      <div className="card anim d2" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 6 }}>
          <Avatar d={deputy} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 750 }}>2. Ваш голос</div>
            <div style={{ color: "var(--text-2)", fontSize: 13.5 }}>{deputy.fullName} · {deputy.position}</div>
          </div>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 13.5, margin: "12px 0 18px" }}>
          Один голос на одного депутата. Голос анонимен, его можно изменить позже. Профессиональный
          рейтинг считается отдельно — из открытых данных.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHOICES.map((c) => (
            <button
              key={c.v}
              type="button"
              onClick={() => pick(c.v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--bg)",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all 0.25s var(--ease)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.12)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: c.bg,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {c.v === "for" ? "＋" : c.v === "against" ? "−" : "○"}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 15.5, display: "block" }}>{c.label}</span>
                <span style={{ color: "var(--text-2)", fontSize: 12.5 }}>{c.sub}</span>
              </span>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>→</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setStep("deputy")}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Выбрать другого депутата
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Шаг 3: подтверждение через бота ---------- */
  return (
    <div className="card anim d2" style={{ marginTop: 14, textAlign: "center", padding: "40px 30px" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(180deg, var(--accent-2), var(--accent))",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          margin: "0 auto 18px",
          boxShadow: "var(--sh-accent-lg)",
        }}
      >
        ✈
      </div>
      <h2 style={{ justifyContent: "center" }}>3. Подтвердите голос в Telegram</h2>
      <p style={{ color: "var(--text-2)", fontSize: 14.5, maxWidth: 520, margin: "0 auto 20px" }}>
        Ваш выбор: <b>{CHOICES.find((c) => c.v === choice)?.label}</b>. Бот проверит одноразовый
        токен и членство в канале — это защита от ботов и накруток. Голос анонимен.
      </p>
      <div
        style={{
          background: "var(--bg)",
          border: "1px dashed var(--border)",
          borderRadius: 10,
          padding: "12px 16px",
          fontFamily: "monospace",
          fontSize: 13,
          color: "var(--text-2)",
          maxWidth: 520,
          margin: "0 auto 20px",
          wordBreak: "break-all",
        }}
      >
        t.me/NarodnyRatingBot?start=confirm_{mockToken}
      </div>
      <button className="btn btn-lg" type="button" style={{ width: "100%", maxWidth: 380 }}>
        Открыть Telegram-бота
      </button>
      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => setStep("choice")}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Изменить выбор
        </button>
      </div>
      <div className="form-hint" style={{ marginTop: 14 }}>
        Токен действителен 10 минут. Голос заменит ваш предыдущий голос по этому депутату.
      </div>
    </div>
  );
}
