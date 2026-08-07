import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

/** Способы поддержки проекта (этап 1 — заглушки адресов). */
const DONATE_METHODS = [
  {
    icon: "₿",
    name: "Bitcoin (BTC)",
    desc: "Сеть Bitcoin. Адрес будет опубликован после запуска бэкенда.",
    address: "bc1q…заглушка…",
    color: "#F7931A",
  },
  {
    icon: "◆",
    name: "USDT (TRC-20)",
    desc: "Сеть Tron — низкая комиссия. Адрес будет опубликован позже.",
    address: "T…заглушка…",
    color: "#26A17B",
  },
  {
    icon: "◎",
    name: "TON",
    desc: "Сеть The Open Network. Адрес будет опубликован позже.",
    address: "UQ…заглушка…",
    color: "#0098EA",
  },
];

/** Страница «Поддержать»: крипто-донаты и предоставление ресурсов. */
export default function SupportPage() {
  return (
    <>
      <Navbar active="support" />

      <div className="hero" style={{ padding: "52px 0 60px" }}>
        <div className="wrap">
          <span className="eyebrow anim d1">Поддержка проекта</span>
          <h1 className="anim d2" style={{ fontSize: 36 }}>
            Помогите системе работать
          </h1>
          <p className="sub anim d3">
            «Народный рейтинг» — независимый проект. Он живёт на пожертвования и помощь
            сообщества. Каждый вклад делает контроль за властью устойчивее.
          </p>
        </div>
      </div>

      <div className="wrap">
        {/* Крипто-донаты */}
        <div className="card lift anim d1" style={{ marginTop: 30 }}>
          <div className="sec-head">
            <h2>💠 Поддержать криптовалютой</h2>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 14.5, marginBottom: 18 }}>
            Все поступления фиксируются в прозрачном публичном отчёте «куда уходят средства».
            Финальные платежи проводятся только с подтверждением человека.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {DONATE_METHODS.map((m) => (
              <div
                key={m.name}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "18px 18px",
                  transition: "transform 0.25s var(--ease), box-shadow 0.25s var(--ease)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: m.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 19,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  {m.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15.5 }}>{m.name}</div>
                <div style={{ color: "var(--text-2)", fontSize: 13, margin: "6px 0 10px" }}>
                  {m.desc}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12.5,
                    background: "var(--surface)",
                    border: "1px dashed var(--border)",
                    borderRadius: 8,
                    padding: "8px 10px",
                    wordBreak: "break-all",
                    color: "var(--text-2)",
                  }}
                >
                  {m.address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Помощь ресурсами */}
        <div className="card lift anim d2 mt">
          <div className="sec-head">
            <h2>🖥 Предоставить ресурсы</h2>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 14.5, marginBottom: 18 }}>
            Вы можете передать уже оплаченные ресурсы. На них размещаются только зашифрованные
            данные и публичные зеркала — ядро и ключи на пользовательских ресурсах никогда не
            хранятся.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { icon: "☁", title: "VPS / хостинг", text: "Для зеркал и зашифрованных шардов" },
              { icon: "🌐", title: "Домен", text: "Резервные домены для живучести" },
              { icon: "🗄", title: "Облачное хранилище", text: "Для бэкапов и снапшотов" },
            ].map((r) => (
              <div
                key={r.title}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{r.title}</div>
                  <div style={{ color: "var(--text-2)", fontSize: 12.5, marginTop: 2 }}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="disclaimer anim d3">
          ⚠ Этап 1: реквизиты и обработка донатов — заглушки. Реальный приём средств и прозрачный
          публичный отчёт появятся вместе с бэкендом (Этап 2).
        </div>

        <div className="card join anim d4 mt" style={{ textAlign: "center" }}>
          <h3>Самая ценная поддержка — участие</h3>
          <p style={{ maxWidth: 520, margin: "0 auto 16px" }}>
            Оцените работу депутатов и расскажите о сервисе. Чем больше людей участвует, тем
            объективнее картина.
          </p>
          <Link className="btn btn-lg" href="/deputies" style={{ display: "inline-flex" }}>
            Перейти к депутатам
          </Link>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
