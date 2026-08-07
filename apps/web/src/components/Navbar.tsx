"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TelegramLoginModal from "./TelegramLoginModal";

interface NavbarProps {
  /** Активный пункт меню: 'home' | 'deputies' | 'how' | 'support' */
  active?: string;
}

/**
 * Верхняя навигация сайта. Липкая, с эффектом размытия фона.
 * Кнопка «Войти через Telegram» открывает модальное окно входа (этап 1 — мок).
 */
export default function Navbar({ active = "" }: NavbarProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Восстановление состояния входа из localStorage (этап 1)
  useEffect(() => {
    const saved = localStorage.getItem("nr_demo_user");
    if (saved) setUserName(saved);
  }, []);

  function handleLogin(name: string) {
    setUserName(name);
    localStorage.setItem("nr_demo_user", name);
  }

  function handleLogout() {
    setUserName(null);
    localStorage.removeItem("nr_demo_user");
  }

  const links = [
    { href: "/", key: "home", label: "Главная" },
    { href: "/deputies", key: "deputies", label: "Депутаты" },
    { href: "/how-it-works", key: "how", label: "Как это работает" },
    { href: "/support", key: "support", label: "Поддержать" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="wrap nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">НР</span> Народный рейтинг
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.key} href={l.href} className={active === l.key ? "active" : ""}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="nav-right">
            {userName ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#E2E8F0", fontSize: 14 }}>
                  👤 <b>{userName}</b>
                </span>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "8px 14px", fontSize: 13 }}
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => setLoginOpen(true)}>
                ✈ Войти через Telegram
              </button>
            )}
          </div>
        </div>
      </nav>

      <TelegramLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}
