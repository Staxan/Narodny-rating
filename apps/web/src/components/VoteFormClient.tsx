"use client";

import { useMemo, useState } from "react";
import type { Deputy } from "@/lib/types";

type Step = "deputy" | "form" | "confirm";

interface VoteFormClientProps {
  deputies: Deputy[];
}

/** Ответы формы народной оценки (ТЗ 1.1, раздел 5.5) */
interface Answers {
  improvements: "" | "yes" | "partly" | "no";
  promises: number; // 1–5
  response: number; // 1–5
  trust: number; // 1–5
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

/** Пятибалльная шкала с анимацией выбора */
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

/** Да/нет/частично и аналогичные варианты */
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
 * Форма народной оценки.
 * Этап 1 (без бэкенда): полный UX-цикл — выбор депутата → форма → экран
 * подтверждения с deep-link на бота. Реальная запись голоса подключается
 * на этапе бэкенда (POST /votes/prepare → подтверждение ботом).
 */
export default function VoteFormClient({ deputies }: VoteFormClientProps) {
  const [step, setStep] = useState<Step>("deputy");
  const [deputyId, setDeputyId] = useState("");
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const [mockToken, setMockToken] = useState("");

  const deputy = useMemo(() => deputies.find((d) => d.id === deputyId), [deputies, deputyId]);

  // Форма заполнена, если все обязательные вопросы отвечены (вопросы 1–5 из ТЗ)
  const complete =
    answers.improvements !== "" &&
    answers.promises > 0 &&
    answers.response > 0 &&
    answers.trust > 0 &&
    answers.support !== "";

  function submitForm() {
    if (!complete || !deputy) return;
    // Мок-токен подтверждения (в проде: POST /api/v1/votes/prepare)
    const token = Array.from({ length: 24 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"[Math.floor(Math.random() * 57)]
    ).join("");
    setMockToken(token);
    setStep("confirm");
  }

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
                setStep("form");
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
              <span
                className="ava"
                style={{
                  width: 40,
                  height: 40,
                  fontSize: 13,
                  background: `linear-gradient(135deg, ${d.avatarColor[0]}, ${d.avatarColor[1]})`,
                }}
              >
                {d.initials}
              </span>
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

  /* ---------- Шаг 2: форма оценки ---------- */
  if (step === "form" && deputy) {
    return (
      <div className="card anim d2" style={{ marginTop: 14 }}>
        <h2>2. Оцените работу: {deputy.fullName}</h2>
        <p style={{ color: "var(--text-2)", fontSize: 13.5, marginBottom: 20 }}>
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

        {answers.problem && answers.problem !== "Нет проблемы" && (
          <div className="form-group anim">
            <div className="form-q">Комментарий к проблеме (необязательно, до 500 символов)</div>
            <textarea
              value={answers.comment}
              onChange={(e) => setAnswers({ ...answers, comment: e.target.value.slice(0, 500) })}
              maxLength={500}
              rows={3}
              style={{
                width: "100%",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "inherit",
                fontSize: 14.5,
                resize: "vertical",
                outline: "none",
                background: "var(--bg)",
                transition: "border-color 0.25s var(--ease), box-shadow 0.25s var(--ease)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div className="form-hint">
              {answers.comment.length}/500 · Комментарий не публикуется: показываются только
              обезличенные счётчики категорий проблем.
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-ghost" type="button" onClick={() => setStep("deputy")}>
            ← Назад
          </button>
          <button
            className="btn btn-lg"
            type="button"
            disabled={!complete}
            onClick={submitForm}
            style={{ opacity: complete ? 1 : 0.5, cursor: complete ? "pointer" : "not-allowed" }}
          >
            Подтвердить голос →
          </button>
        </div>
        {!complete && (
          <div className="form-hint" style={{ marginTop: 10 }}>
            Ответьте на обязательные вопросы 1–5, чтобы продолжить.
          </div>
        )}
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
        Сейчас вы будете перенаправлены в Telegram-бота проекта. Это нужно, чтобы убедиться, что
        голосует живой человек, состоящий в канале. Ваш голос анонимен: система хранит только
        необратимый хэш вашего идентификатора.
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
          onClick={() => {
            setStep("form");
            setMockToken("");
          }}
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
        Токен действителен 10 минут. После подтверждения голос будет учтён или заменит ваш
        предыдущий голос по этому депутату.
      </div>
    </div>
  );
}
