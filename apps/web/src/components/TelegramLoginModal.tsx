"use client";

import { useState } from "react";
import Modal from "./Modal";

interface TelegramLoginModalProps {
  open: boolean;
  onClose: () => void;
  /** Вызывается при успешном «входе» (этап 1 — мок) */
  onLogin: (name: string) => void;
}

type Step = "intro" | "channel" | "success";

/**
 * Модальное окно входа через Telegram (этап 1 — визуальная часть).
 * Реальный Telegram Login Widget и проверка членства в канале
 * подключаются на этапе бэкенда.
 */
export default function TelegramLoginModal({ open, onClose, onLogin }: TelegramLoginModalProps) {
  const [step, setStep] = useState<Step>("intro");

  function handleClose() {
    onClose();
    setTimeout(() => setStep("intro"), 250);
  }

  function finish() {
    onLogin("Андрей");
    setStep("success");
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={460}>
      {step === "intro" && (
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #38BDF8, #0284C7)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(2,132,199,0.4)",
            }}
          >
            ✈
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Вход через Telegram</div>
          <p style={{ color: "var(--text-2)", fontSize: 14, margin: "10px 0 18px" }}>
            Для входа используется ваш Telegram-аккаунт. Мы не получаем доступ к вашим
            сообщениям — только имя, фото профиля и идентификатор.
          </p>

          {/* Имитация виджета Telegram */}
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0D9488, #0F766E)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              НР
            </div>
            <div style={{ fontSize: 13.5 }}>
              <b>NarodnyRatingBot</b>
              <div style={{ color: "var(--text-2)", fontSize: 12.5, marginTop: 2 }}>
                Бот запросит: имя, username, фото профиля
              </div>
            </div>
          </div>

          <button className="btn btn-lg" style={{ width: "100%" }} onClick={() => setStep("channel")}>
            Продолжить как Андрей
          </button>
          <div className="form-hint" style={{ marginTop: 12 }}>
            Этап 1: демонстрационный вход. Реальная авторизация через Telegram Login Widget
            подключается с бэкендом.
          </div>
        </div>
      )}

      {step === "channel" && (
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(180deg, var(--accent-2), var(--accent))",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              margin: "0 auto 16px",
              boxShadow: "var(--sh-accent-lg)",
            }}
          >
            📢
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Проверка подписки на канал</div>
          <p style={{ color: "var(--text-2)", fontSize: 14, margin: "10px 0 18px" }}>
            Право голоса получают участники официального канала проекта, состоящие в нём
            не менее <b>24 часов</b>. Это защищает систему от ботов и накруток.
          </p>
          <div
            style={{
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              borderRadius: 12,
              padding: "13px 16px",
              fontSize: 14,
              color: "#065F46",
              marginBottom: 18,
            }}
          >
            ✓ Вы состоите в канале «Народный рейтинг» · стаж 42 дня
          </div>
          <button className="btn btn-lg" style={{ width: "100%" }} onClick={finish}>
            Подтвердить вход
          </button>
        </div>
      )}

      {step === "success" && (
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #34D399, #10B981)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Вы вошли!</div>
          <p style={{ color: "var(--text-2)", fontSize: 14, margin: "10px 0 18px" }}>
            Теперь вы можете оценивать работу депутатов. Голосование анонимно и защищено от
            накруток.
          </p>
          <button className="btn btn-lg" style={{ width: "100%" }} onClick={handleClose}>
            Продолжить
          </button>
        </div>
      )}
    </Modal>
  );
}
