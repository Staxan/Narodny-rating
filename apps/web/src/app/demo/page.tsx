import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ElectionBanner from "@/components/ElectionBanner";
import HomeTopList from "@/components/HomeTopList";
import HeroFilters from "@/components/HeroFilters";
import ParticipantCategories from "@/components/ParticipantCategories";
import DataPipelineCard from "@/components/DataPipelineCard";
import { ParticipantCardMeta, ParticipantCommunitySection } from "@/components/ExpandedPresentation";
import { DEPUTIES, FEED_EVENTS, OVERVIEW_STATS, getLevelCounts } from "@/lib/mock-data";
import Link from "next/link";

/**
 * Главная страница — дашборд проекта.
 * Этап 1: данные из мок-набора, структура полностью соответствует ТЗ 1.1.
 */
export default function HomePage() {
  const counts = getLevelCounts();

  return (
    <>
      <Navbar active="home" />

      {/* Hero-блок */}
      <div className="hero">
        <div className="wrap">
          <span className="eyebrow anim d1">◆ Выборы · сентябрь 2026</span>
          <h1 className="anim d2">
            Узнай своего депутата <em>до голосования</em>
          </h1>
          <p className="sub anim d3">
            Обещания, результаты, доходы и имущество депутатов — проверяемые факты плюс анонимная
            народная оценка. Защити свой голос от ботов и накруток.
          </p>
          <HeroFilters deputies={DEPUTIES} />
        </div>
      </div>

      <div className="wrap">
        {/* Баннер выборов */}
        <ElectionBanner />

        {/* Универсальная модель участника и демонстрационный контур профиля */}
        <ParticipantCategories />
        <ParticipantCardMeta />
        <ParticipantCommunitySection />

        {/* Контур подготовки данных */}
        <DataPipelineCard />

        {/* Статистика системы */}
        <div className="stats">
          <div className="stat anim d1">
            <div className="num">{OVERVIEW_STATS.deputiesCount.toLocaleString("ru-RU")}</div>
            <div className="lbl">депутатов в базе</div>
          </div>
          <div className="stat anim d2">
            <div className="num">{OVERVIEW_STATS.votesCount.toLocaleString("ru-RU")}</div>
            <div className="lbl">подтверждённых голосов</div>
          </div>
          <div className="stat anim d3">
            <div className="num">{OVERVIEW_STATS.regionsCount}</div>
            <div className="lbl">регионов</div>
          </div>
        </div>

        {/* Основная сетка: топ + лента */}
        <div className="main-grid">
          <HomeTopList deputies={DEPUTIES} counts={counts} />

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="card accent-blue lift anim d2">
              <div className="sec-head">
                <h2>⟳ Последние изменения</h2>
              </div>
              {FEED_EVENTS.map((e) => (
                <div className="feed-item" key={e.id}>
                  <div
                    className="feed-dot"
                    style={{ background: e.iconBg, color: e.iconColor }}
                  >
                    {e.icon}
                  </div>
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: e.text }} />
                    <div className="feed-time">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card join anim d3">
              <h3>Твой округ — твой депутат</h3>
              <p>
                Найдите депутата своего округа, изучите обещания и результаты, оцените работу до
                выборов. Голосование анонимно.
              </p>
              <Link className="btn btn-block" href="/deputies">
                ✈ Найти своего депутата
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}