"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DEMO_DELAY_MS = 5_000;
const UNLOCK_KEY = "nr_full_presentation";
const CHANNEL_NAME = "nr-presentation";

/** Тестовое уведомление демо-портала и сигнал для открытого лендинга. */
export default function DemoNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(UNLOCK_KEY, "1");
      setOpen(true);
      const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;
      channel?.postMessage("presentation-unlocked");
      channel?.close();
    }, DEMO_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;
  return (
    <div className="demo-notice-backdrop" role="dialog" aria-modal="true" aria-labelledby="demo-notice-title">
      <div className="demo-notice-card">
        <span className="unlock-badge">✦ Новый уровень доступен</span>
        <h2 id="demo-notice-title">Вам доступна полная презентация</h2>
        <p>Вы уже познакомились с демонстрационным порталом.</p>
        <div className="demo-notice-actions">
          <Link className="btn btn-lg" href="/presentation/expanded">Открыть презентацию <span>→</span></Link>
          <button className="btn btn-ghost" onClick={() => setOpen(false)}>Продолжить просмотр</button>
        </div>
      </div>
    </div>
  );
}

export { DEMO_DELAY_MS };

// В production задержка меняется одной константой на 90 секунд.
