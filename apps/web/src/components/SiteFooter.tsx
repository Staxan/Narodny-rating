import Link from "next/link";

/** Футер сайта с обязательным дисклеймером об открытых источниках. */
export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", width: "100%" }}>
        <span>
          © Народный рейтинг · Данные собраны из открытых источников. Обнаруженные несоответствия
          не являются обвинением и требуют проверки.
        </span>
        <span>
          <Link href="/how-it-works">Как это работает</Link> · <a href="#">Канал проекта</a> ·{" "}
          <a href="#">Контакты</a>
        </span>
      </div>
    </footer>
  );
}
