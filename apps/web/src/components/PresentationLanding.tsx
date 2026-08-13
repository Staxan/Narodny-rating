"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DEMO_DELAY_MS = 5_000;
const ACCESS_KEY = "nr_landing_access";
const UNLOCK_KEY = "nr_full_presentation";
const CHANNEL_NAME = "nr-presentation";

function hasUnlockedPresentation() {
  return typeof window !== "undefined" && localStorage.getItem(UNLOCK_KEY) === "1";
}

/** Закрытая презентация проекта: пароль, первый уровень и расширенный уровень. */
export default function PresentationLanding() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setAuthorized(sessionStorage.getItem(ACCESS_KEY) === "1");
    setUnlocked(hasUnlockedPresentation());

    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;
    const onMessage = (event: MessageEvent) => {
      if (event.data === "presentation-unlocked") {
        localStorage.setItem(UNLOCK_KEY, "1");
        setUnlocked(true);
      }
    };
    channel?.addEventListener("message", onMessage);
    const onStorage = (event: StorageEvent) => {
      if (event.key === UNLOCK_KEY && event.newValue === "1") setUnlocked(true);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      channel?.removeEventListener("message", onMessage);
      channel?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function login(event: React.FormEvent) {
    event.preventDefault();
    if (password !== "123") {
      setError("Неверный пароль");
      return;
    }
    sessionStorage.setItem(ACCESS_KEY, "1");
    setAuthorized(true);
    setError("");
  }

  if (!authorized) {
    return (
      <main className="access-screen">
        <div className="access-glow" />
        <form className="access-card" onSubmit={login}>
          <div className="brand-mark">НР</div>
          <span className="eyebrow">Закрытая презентация</span>
          <h1>Народный рейтинг</h1>
          <p>Введите пароль, чтобы открыть презентацию проекта.</p>
          <label htmlFor="landing-password">Пароль</label>
          <input id="landing-password" type="password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Введите пароль" />
          {error && <div className="access-error">{error}</div>}
          <button className="btn btn-lg" type="submit">Открыть презентацию <span>→</span></button>
          <small>Тестовый доступ</small>
        </form>
      </main>
    );
  }

  return (
    <div className="presentation-page">
      <header className="presentation-nav">
        <Link href="/" className="presentation-logo"><span className="logo-mark">НР</span> Народный рейтинг</Link>
        <nav><a href="#about">О проекте</a><a href="#principles">Принципы</a></nav>
        <div className="presentation-nav-actions"><Link className="btn btn-ghost" href="/presentation/expanded">Расширенная презентация</Link><Link className="btn" href="/demo">Посмотреть демо <span>↗</span></Link></div>
      </header>

      <main>
        <section className="presentation-hero">
          <div className="wrap presentation-hero-grid">
            <div className="presentation-copy anim d1">
              <span className="eyebrow">Инфраструктура общественного доверия</span>
              <h1>Понятный рейтинг.<br /><em>Независимый взгляд.</em></h1>
              <p>Народный рейтинг собирает проверяемые данные и общественную оценку, чтобы граждане могли видеть работу представителей власти целостно и без лишнего шума.</p>
              <div className="presentation-actions"><Link className="btn btn-lg" href="/demo">Посмотреть демо-портал <span>↗</span></Link><a className="text-link" href="#about">Узнать больше ↓</a></div>
              <div className="hero-note"><span>●</span> Проект развивается поэтапно и открывает правила работы</div>
            </div>
            <div className="hero-visual anim d3" aria-label="Предпросмотр карточки рейтинга">
              <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
              <div className="rating-preview"><div className="preview-top"><span className="mini-mark">НР</span><span>Народный рейтинг <b>● live</b></span></div><div className="preview-person"><div className="person-avatar">АК</div><div><strong>Алексей Крылов</strong><small>Депутат · Московская область</small></div></div><div className="preview-score"><div><small>Народная оценка</small><strong>74<span>/100</span></strong></div><div className="score-ring">74</div></div><div className="preview-bar"><i /></div><div className="preview-foot"><span>Проверяемые данные</span><span>1 248 голосов</span></div></div>
            </div>
          </div>
        </section>

        <section id="about" className="presentation-section wrap"><div className="section-kicker">01 · Зачем это нужно</div><div className="section-heading"><h2>Система, которая помогает<br /><em>разобраться в фактах</em></h2><p>Информация о работе представителей власти часто разрознена. Мы собираем её в одном месте и дополняем анонимной оценкой граждан.</p></div><div className="feature-grid"><article><span>01</span><h3>Проверяемые факты</h3><p>Обещания, результаты, доходы и имущество — с указанием источников и историей изменений.</p></article><article><span>02</span><h3>Голос граждан</h3><p>Простая оценка «за», «против» или «воздержался» с подтверждением через Telegram.</p></article><article><span>03</span><h3>Прозрачные правила</h3><p>Профессиональная и народная оценки разделены, а методика доступна для проверки.</p></article></div></section>

        <section id="principles" className="dark-section"><div className="wrap"><div className="section-kicker">02 · Принципы</div><div className="section-heading light"><h2>Независимая система<br /><em>для обычных людей</em></h2><p>Проект строится как распределённая и максимально независимая инфраструктура. Его устойчивость не должна зависеть от одного сервера, владельца или поставщика.</p></div><div className="principle-grid"><div><b>◈</b><h3>Децентрализация</h3><p>Резервирование данных, доменов и инфраструктуры снижает зависимость от одной точки отказа.</p></div><div><b>↗</b><h3>Открытое развитие</h3><p>Люди могут поддерживать проект ресурсами, хостингом, доменами и собственными инициативами.</p></div><div><b>◎</b><h3>Технологии во благо</h3><p>Автоматизация и агенты помогают поддерживать сервис, а правила работы остаются понятными и проверяемыми.</p></div></div></div></section>

        

        {!unlocked && <section className="locked-teaser"><div className="wrap"><span>Следующий уровень открывается после знакомства с демо-порталом</span><span className="teaser-line" /></div></section>}
      </main>
      <footer className="presentation-footer"><div className="wrap"><strong><span className="logo-mark">НР</span> Народный рейтинг</strong><span>Презентация проекта · 2026</span></div></footer>
    </div>
  );
}

export { DEMO_DELAY_MS, CHANNEL_NAME, UNLOCK_KEY };
