/** Баннер единого дня голосования со счётчиком дней до выборов 13.09.2026. */
export default function ElectionBanner() {
  // Динамический подсчёт дней до единого дня голосования
  const target = new Date("2026-09-13T00:00:00");
  const days = Math.max(
    0,
    Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="elect anim d4">
      <div className="elect-ic">🗳</div>
      <div>
        <h3>Единый день голосования — 13 сентября 2026</h3>
        <p>
          Оцените работу депутатов до выборов. Голосование на платформе анонимно и защищено от
          накруток.
        </p>
      </div>
      <div className="count">
        <div className="n">{days}</div>
        <div className="l">дней до выборов</div>
      </div>
    </div>
  );
}
