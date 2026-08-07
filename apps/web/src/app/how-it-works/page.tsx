import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

/** Блоки профессионального рейтинга и веса (формула v2.0 — два рейтинга) */
const FORMULA_BLOCKS = [
  { name: "Выполнение обещаний", weight: 30, source: "Статусы обещаний из открытых источников" },
  { name: "Управленческий результат", weight: 25, source: "Показатели территории/отрасли, работа в парламенте" },
  { name: "Антикоррупционная чистота", weight: 20, source: "Соответствие доходов и имущества (пока «нет данных»)" },
  { name: "Бюджетная дисциплина", weight: 15, source: "Сроки, расходы, отклонения по открытым бюджетным данным" },
  { name: "Реакция на проблемы", weight: 5, source: "Скорость решения обращений и кризисов" },
  { name: "Прозрачность", weight: 5, source: "Открытость отчётов и данных" },
];

const STEPS = [
  {
    n: "1",
    title: "Вход через Telegram",
    text: "Регистрация на сайте только через Telegram Login Widget. Это исключает анонимные фейковые аккаунты.",
  },
  {
    n: "2",
    title: "Проверка членства в канале",
    text: "Система проверяет, что вы состоите в официальном канале проекта не менее 24 часов. Свежие боты-аккаунты не проходят этот порог.",
  },
  {
    n: "3",
    title: "Одноразовый токен",
    text: "После заполнения формы оценки генерируется одноразовый токен подтверждения со сроком жизни 10 минут.",
  },
  {
    n: "4",
    title: "Подтверждение в боте",
    text: "Вы переходите в Telegram-бота по ссылке t.me/BotName?start=confirm_ТОКЕН. Бот проверяет токен, ваш аккаунт и членство в канале.",
  },
  {
    n: "5",
    title: "Анонимная запись голоса",
    text: "В базе хранится только необратимый хэш вашего Telegram-идентификатора, оценки и время. Связи «человек → конкретный голос» не существует.",
  },
  {
    n: "6",
    title: "Переголосование",
    text: "Вы можете изменить свой голос в любой момент — один подтверждённый идентификатор = один активный голос по каждому депутату.",
  },
];

/** Страница «Как это работает»: формула, механизм голосования, защита. */
export default function HowItWorksPage() {
  return (
    <>
      <Navbar active="how" />

      <div className="hero" style={{ padding: "52px 0 60px" }}>
        <div className="wrap">
          <span className="eyebrow anim d1">Прозрачность</span>
          <h1 className="anim d2" style={{ fontSize: 36 }}>Как это работает</h1>
          <p className="sub anim d3">
            Система считает два независимых рейтинга: профессиональный — из открытых данных,
            и народный — по голосам граждан. Их сравнение защищает от накруток.
          </p>
        </div>
      </div>

      <div className="wrap">
        {/* Два рейтинга */}
        <div className="card lift anim d1" style={{ marginTop: 30 }}>
          <div className="sec-head">
            <h2>⚖ Два рейтинга — две независимые оценки</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontWeight: 750, fontSize: 16, marginBottom: 8 }}>📊 Профессиональный рейтинг</div>
              <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>
                Строится только из открытых источников: обещания и их выполнение, работа в
                парламенте, доходы и имущество, бюджетная дисциплина. <b>Голоса людей на него не
                влияют.</b> Это объективная картина по фактам.
              </p>
            </div>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontWeight: 750, fontSize: 16, marginBottom: 8 }}>👥 Народный рейтинг</div>
              <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>
                Прямое голосование граждан: <b>за / против / воздержался</b>. Балл — процент
                голосов «за». Анонимно, с подтверждением через Telegram. Это отношение людей к
                депутату.
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              background: "#FFF7ED",
              border: "1px solid #FED7AA",
              color: "#9A3412",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 13.5,
            }}
          >
            ⚠ <b>Защита от накруток через сравнение:</b> если у депутата низкий профессиональный
            рейтинг (факты плохие), но подозрительно высокий народный — расхождение видно сразу и
            уходит на проверку. Две независимые оценки надёжнее одной.
          </div>
        </div>

        {/* Формула профессионального рейтинга */}
        <div className="card lift anim d2 mt">
          <div className="sec-head">
            <h2>▤ Формула профессионального рейтинга · версия 2.0 от 08.08.2026</h2>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 14.5, marginBottom: 18 }}>
            Итоговый балл = средневзвешенное по заполненным блокам (0–100). Если блок не заполнен,
            он показывается явно как «нет данных» и не участвует в расчёте. Веса меняются только
            публично, с фиксацией версии формулы.
          </p>
          {FORMULA_BLOCKS.map((b) => (
            <div className="blk" key={b.name}>
              <div className="blk-name">{b.name} <span className="w">· вес {b.weight}%</span></div>
              <div style={{ flex: 1, color: "var(--text-2)", fontSize: 13.5 }}>{b.source}</div>
            </div>
          ))}
        </div>

        {/* Механизм голосования */}
        <div className="card lift anim d2 mt">
          <div className="sec-head">
            <h2>🔐 Как защищён ваш голос</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "linear-gradient(180deg, var(--accent-2), var(--accent))",
                    color: "#fff",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "var(--sh-accent)",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</div>
                  <div style={{ color: "var(--text-2)", fontSize: 13.5, marginTop: 3 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Защита от накруток */}
        <div className="card lift anim d3 mt">
          <div className="sec-head">
            <h2>🛡 Защита от накруток и манипуляций</h2>
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Голосовать могут только реальные Telegram-аккаунты: вход через Login Widget и подтверждение в боте.",
              "Порог членства в канале — 24 часа: боты «на один день» не успевают получить право голоса.",
              "Один идентификатор — один активный голос по каждому депутату (технически гарантировано).",
              "Одноразовые токены со сроком жизни 10 минут, привязанные к конкретному аккаунту.",
              "Анонимность: в базе нет Telegram-идентификаторов — только необратимые хэши. Даже администраторы не видят, кто как голосовал.",
              "Комментарии граждан не публикуются — в карточках показываются только обезличенные счётчики категорий проблем.",
              "Подозрительные всплески голосов отслеживаются и уходят на проверку.",
            ].map((t, i) => (
              <li key={i} style={{ display: "flex", gap: 11, fontSize: 14.5 }}>
                <span style={{ color: "var(--accent)", fontWeight: 800 }}>✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="disclaimer anim d4">
          ⚠ Формула и правила могут уточняться — каждое изменение фиксируется новой версией и
          отображается на этой странице. Изменение задним числом под конкретного депутата
          невозможно: все версии сохраняются.
        </div>

        <div className="card join anim d5 mt" style={{ textAlign: "center" }}>
          <h3>Готовы участвовать?</h3>
          <p style={{ maxWidth: 520, margin: "0 auto 16px" }}>
            Найдите депутата своего округа и оцените его работу. Это займёт две минуты, а ваш голос
            будет анонимным и защищённым.
          </p>
          <Link className="btn btn-lg" href="/deputies" style={{ display: "inline-flex" }}>
            Перейти к списку депутатов
          </Link>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
