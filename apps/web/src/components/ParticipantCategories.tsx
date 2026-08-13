import Link from "next/link";
import type { ParticipantCategory } from "@/lib/types";

const categories: { key: ParticipantCategory; icon: string; title: string; text: string; count: string; href: string }[] = [
  { key: "deputy", icon: "◈", title: "Депутаты", text: "Федеральный, региональный и муниципальный уровни", count: "6 в демо", href: "/deputies" },
  { key: "official", icon: "◎", title: "Чиновники", text: "Представители исполнительной власти следующего этапа", count: "Скоро", href: "/how-it-works" },
  { key: "institution", icon: "▦", title: "Органы и учреждения", text: "Организации и ведомства с понятными полномочиями", count: "Скоро", href: "/how-it-works" },
  { key: "initiative", icon: "✦", title: "Инициативы", text: "Общественные проекты и предложения граждан", count: "Скоро", href: "/how-it-works" },
];

/** Категории универсальной карточки участника на дашборде. */
export default function ParticipantCategories() {
  return (
    <section className="participant-categories card accent-navy anim d2">
      <div className="sec-head">
        <div><span className="section-kicker">Единая модель участников</span><h2>Категории на дашборде</h2></div>
        <span className="section-hint">Статус и полномочия</span>
      </div>
      <p className="categories-intro">Одна карточка участника — разные типы и уровни полномочий. Сейчас открыт раздел депутатов, остальные категории заложены в архитектуре.</p>
      <div className="category-grid">
        {categories.map((item) => (
          <Link className={`category-card ${item.key === "deputy" ? "selected" : ""}`} href={item.href} key={item.key}>
            <span className="category-icon">{item.icon}</span>
            <span><strong>{item.title}</strong><small>{item.text}</small></span>
            <b>{item.count}</b>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { categories };
