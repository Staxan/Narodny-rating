"use client";

import { useState } from "react";
import type { Deputy, PeopleChoice } from "@/lib/types";
import Modal from "./Modal";
import Avatar from "./Avatar";

interface VoteModalProps {
  d: Deputy;
}

/**
 * Модальное окно народного голосования: За / Против / Воздержался.
 * Народный рейтинг считает процент голосов «за» (балл 0–100).
 * Профессиональный рейтинг строится из открытых данных и на голоса людей не реагирует.
 *
 * Этап 1: полный UX-цикл (выбор → подтверждение через бота), запись голоса —
 * заглушка до подключения бэкенда.
 */
export default function VoteModal({ d }: VoteModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choice" | "confirm">("choice");
  const [choice, setChoice] = useState<PeopleChoice | null>(null);
  const [mockToken, setMockToken] = useState("");

  function pick(c: PeopleChoice) {
    setChoice(c);
    // Мок-токен подтверждения (в проде: POST /api/v1/votes/prepare)
    const token = Array.from({ length: 24 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"[Math.floor(Math.random() * 57)]
    ).join("");
    setMockToken(token);
    setStep("confirm");
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("choice");
      setChoice(null);
      setMockToken("");
    }, 250);
  }

  const CHOICES: { v: PeopleChoice; label: string; sub: string; color: string; bg: string }[] = [
    { v: "for", label: "За", sub: "Поддерживаю работу депутата", color: "#065F46", bg: "linear-gradient(180deg, #34D399, #10B981)" },
    { v: "against", label: "Против", sub: "Не поддерживаю работу депутата", color: "#991B1B", bg: "linear-gradient(180deg, #F87171, #EF4444)" },
    { v: "abstain", label: "Воздержался", sub: "Не могу оценить работу", color: "#475569", bg: "linear-gradient(180deg, #CBD5E1, #94A3B8)" },
  ];

  return (
    <>
      <button className="btn-vote" onClick={() => setOpen(true)}>Проголосовать</button>
      <Modal open={open} onClose={handleClose} maxWidth={480}>
        {step === "choice" ? (
          <>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 6 }}>
              <Avatar d={d} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 750 }}>Народное голосование</div>
                <div style={{ color: "var(--text-2)", fontSize: 13.5 }}>{d.fullName}</div>
              </div>
            </div>
            <p style={{ color: "var(--text-2)", fontSize: 13.5, margin: "12px 0 18px" }}>
              Один голос на одного депутата. Голос анонимен и его можно изменить позже.
              Профессиональный рейтинг считается отдельно — из открытых данных — и на ваш голос не влияет.
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
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(180deg, var(--accent-2), var(--accent))",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                margin: "0 auto 16px",
                boxShadow: "var(--sh-accent-lg)",
              }}
            >
              ✈
            </div>
            <div style={{ fontSize: 19, fontWeight: 750, marginBottom: 10 }}>
              Подтвердите голос в Telegram
            </div>
            <p style={{ color: "var(--text-2)", fontSize: 14, maxWidth: 420, margin: "0 auto 18px" }}>
              Ваш выбор: <b>{CHOICES.find((c) => c.v === choice)?.label}</b>. Бот проверит токен и
              членство в канале — это защита от ботов и накруток. Голос анонимен.
            </p>
            <div
              style={{
                background: "var(--bg)",
                border: "1px dashed var(--border)",
                borderRadius: 10,
                padding: "12px 16px",
                fontFamily: "monospace",
                fontSize: 12.5,
                color: "var(--text-2)",
                maxWidth: 420,
                margin: "0 auto 18px",
                wordBreak: "break-all",
              }}
            >
              t.me/NarodnyRatingBot?start=confirm_{mockToken}
            </div>
            <button className="btn btn-lg" type="button" style={{ width: "100%" }}>
              Открыть Telegram-бота
            </button>
            <div style={{ marginTop: 14 }}>
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
        )}
      </Modal>
    </>
  );
}
