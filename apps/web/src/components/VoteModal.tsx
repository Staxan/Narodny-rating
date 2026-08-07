"use client";

import { useState } from "react";
import type { Deputy } from "@/lib/types";
import Modal from "./Modal";
import Avatar from "./Avatar";

interface VoteModalProps {
  d: Deputy;
}

interface Answers {
  improvements: "" | "yes" | "partly" | "no";
  promises: number;
  response: number;
  trust: number;
  support: "" | "yes" | "no" | "unsure";
  problem: string;
  comment: string;
}

const INITIAL: Answers = {
  improvements: "",
  promises: 0,
  response: 0,
  trust: 0,
  support: "",
  problem: "",
  comment: "",
};

const PROBLEM_CATEGORIES = [
  "Нет проблемы",
  "Дороги",
  "ЖКХ",
  "Медицина",
  "Образование",
  "Безопасность",
  "Социальная поддержка",
  "Другое",
];

function Scale5({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="scale-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`scale-btn ${value === n ? "on" : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function ChoiceRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { v: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div className="scale-row">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          className={`scale-btn ${value === o.v ? "on" : ""}`}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Модальное окно оценки работы депутата.
 * Этап 1: полный UX-цикл (форма → подтверждение через бота), запись голоса —
 * заглушка до подключения бэкенда. Кнопка «Оценить работу» открывает окно.
 */
export default function VoteModal({ d }: VoteModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const [mockToken, setMockToken] = useState("");

  const complete =
    answers.improvements !== "" &&
    answers.promises > 0 &&
    answers.response > 0 &&
    answers.trust > 0 &&
    answers.support !== "";

  function submitForm() {
    if (!complete) return;
    const token = Array.from({ length: 24 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"[Math.floor(Math.random() * 57)]
    ).join("");
    setMockToken(token);
    setStep("confirm");
  }

  function handleClose() {
    setOpen(false);
    // Сброс состояния после закрытия окна
    setTimeout(() => {
      setStep("form");
      setAnswers(INITIAL);
      setMockToken("");
    }, 250);
  }

  return (
    <>
      <button className="btn-vote" onClick={() => setOpen(true)}>Оценить работу</button>
    <Modal open={open} onClose={handleClose} maxWidth={620}>
      {step === "form" ? (
        <>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 6 }}>
            <Avatar d={d} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 750 }}>Оценить работу</div>
              <div style={{ color: "var(--text-2)", fontSize: 13.5 }}>{d.fullName} · {d.position}</div>
            </div>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 13, margin: "10px 0 18px" }}>
            Вопросы 1–5 обязательны. Ваш голос анонимен: система хранит только необратимый хэш
            вашего Telegram-идентификатора.
          </p>

          <div className="form-group">
            <div className="form-q">Видите ли вы улучшения в зоне ответственности депутата?</div>
            <ChoiceRow
              options={[
                { v: "yes", label: "Да" },
                { v: "partly", label: "Частично" },
                { v: "no", label: "Нет" },
              ]}
              value={answers.improvements}
              onChange={(v) => setAnswers({ ...answers, improvements: v })}
            />
          </div>

          <div className="form-group">
            <div className="form-q">Выполняет ли он обещания?</div>
            <Scale5 value={answers.promises} onChange={(v) => setAnswers({ ...answers, promises: v })} />
          </div>

          <div className="form-group">
            <div className="form-q">Как быстро решаются обращения граждан?</div>
            <Scale5 value={answers.response} onChange={(v) => setAnswers({ ...answers, response: v })} />
          </div>

          <div className="form-group">
            <div className="form-q">Доверяете ли вы этому депутату?</div>
            <Scale5 value={answers.trust} onChange={(v) => setAnswers({ ...answers, trust: v })} />
          </div>

          <div className="form-group">
            <div className="form-q">Готовы ли поддержать его на следующих выборах?</div>
            <ChoiceRow
              options={[
                { v: "yes", label: "Да" },
                { v: "no", label: "Нет" },
                { v: "unsure", label: "Затрудняюсь" },
              ]}
              value={answers.support}
              onChange={(v) => setAnswers({ ...answers, support: v })}
            />
          </div>

          <div className="form-group">
            <div className="form-q">Есть ли конкретная проблема? (необязательно)</div>
            <ChoiceRow
              options={PROBLEM_CATEGORIES.map((c) => ({ v: c, label: c }))}
              value={answers.problem}
              onChange={(v) => setAnswers({ ...answers, problem: v })}
            />
          </div>

          <button
            className="btn btn-lg"
            type="button"
            disabled={!complete}
            onClick={submitForm}
            style={{
              width: "100%",
              opacity: complete ? 1 : 0.5,
              cursor: complete ? "pointer" : "not-allowed",
            }}
          >
            Подтвердить голос →
          </button>
          {!complete && (
            <div className="form-hint" style={{ marginTop: 10, textAlign: "center" }}>
              Ответьте на обязательные вопросы 1–5, чтобы продолжить.
            </div>
          )}
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
          <p style={{ color: "var(--text-2)", fontSize: 14, maxWidth: 460, margin: "0 auto 18px" }}>
            Сейчас вы будете перенаправлены в Telegram-бота проекта. Это нужно, чтобы убедиться, что
            голосует живой человек, состоящий в канале. Ваш голос анонимен.
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
              maxWidth: 460,
              margin: "0 auto 18px",
              wordBreak: "break-all",
            }}
          >
            t.me/NarodnyRatingBot?start=confirm_{mockToken}
          </div>
          <button className="btn btn-lg" type="button" style={{ width: "100%", maxWidth: 360 }}>
            Открыть Telegram-бота
          </button>
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              onClick={() => setStep("form")}
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
              ← Вернуться и изменить ответы
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
