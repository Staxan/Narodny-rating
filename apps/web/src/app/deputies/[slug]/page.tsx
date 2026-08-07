import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ScoreRing from "@/components/ScoreRing";
import RatingBars from "@/components/RatingBars";
import RatingChart from "@/components/RatingChart";
import Avatar from "@/components/Avatar";
import VoteModal from "@/components/VoteModal";
import { getDeputyBySlug } from "@/lib/mock-data";
import { LEVEL_NAMES } from "@/lib/types";

/** Локализованные названия статусов обещаний */
const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  fulfilled: { label: "Выполнено", cls: "done" },
  in_progress: { label: "В работе", cls: "work" },
  partial: { label: "Частично", cls: "work" },
  pending: { label: "Ожидает", cls: "work" },
  failed: { label: "Просрочено", cls: "late" },
};

/** Позиции в ключевых голосованиях */
const VOTE_LABELS: Record<string, { label: string; cls: string }> = {
  yea: { label: "За", cls: "yea" },
  nay: { label: "Против", cls: "nay" },
  abstain: { label: "Воздержался", cls: "abs" },
  absent: { label: "Не голосовал(а)", cls: "abs" },
};

/** Иконки типов активов */
const ASSET_ICONS: Record<string, string> = {
  real_estate: "⌂",
  land: "⛟",
  vehicle: "🚗",
  share: "◈",
  other: "◇",
};

/** Звёзды для шкал 1–5 */
function stars(score: number): string {
  return "★".repeat(Math.round(score)) + "☆".repeat(Math.max(0, 5 - Math.round(score)));
}

interface Props {
  params: Promise<{ slug: string }>;
}

/** Карточка депутата — главный экран системы (ТЗ 1.1, раздел 5.3). */
export default async function DeputyPage({ params }: Props) {
  const { slug } = await params;
  const d = getDeputyBySlug(slug);
  if (!d) notFound();

  const done = d.promises.filter((p) => p.status === "fulfilled").length;
  const work = d.promises.filter((p) => p.status === "in_progress" || p.status === "partial" || p.status === "pending").length;
  const late = d.promises.filter((p) => p.status === "failed").length;

  return (
    <>
      <Navbar active="deputies" />

      <div className="wrap">
        <div className="crumbs anim d1">
          <Link href="/deputies">Депутаты</Link> / <a href="#">{LEVEL_NAMES[d.level]}</a> / <b>{d.fullName}</b>
        </div>

        {/* Шапка профиля */}
        <div className="card profile anim d2">
          <Avatar d={d} big />
          <div className="p-info">
            <div className="p-name">{d.fullName}</div>
            <div className="p-pos">{d.position}</div>
            <div className="p-meta">
              <span className="tag frac-tag">
                <i style={{ background: d.factionColor }} />
                Фракция: <b>{d.faction}</b>
              </span>
              {d.district && <span className="tag">Округ: <b>{d.district}</b></span>}
              <span className="tag">Уровень: <b>{d.level === "federal" ? "федеральный" : d.level === "regional" ? "региональный" : "муниципальный"}</b></span>
              <span className="tag">Срок полномочий: <b>{d.termStart} — {d.termEnd}</b></span>
              {d.committee && <span className="tag">Комитет: <b>{d.committee}</b></span>}
              {d.runsAgainIn2026 && (
                <span className="tag hot">🗳 Выдвигается повторно — выборы 13.09.2026</span>
              )}
            </div>
          </div>
          <div style={{ width: 180, flexShrink: 0 }}>
            <ScoreRing score={d.overallScore} votesCount={d.votesCount} />
            <VoteModal d={d} />
          </div>
        </div>

        {/* Блоки рейтинга */}
        <div className="card lift anim d3 mt">
          <h2>
            ▤ Блоки рейтинга{" "}
            <span style={{ fontWeight: 500, fontSize: 13, color: "var(--text-2)", marginLeft: "auto" }}>
              формула открыта · <Link href="/how-it-works" style={{ color: "var(--accent)" }}>v1.0</Link>
            </span>
          </h2>
          <RatingBars blocks={d.ratingBlocks} />
        </div>

        <div className="grid2">
          {/* Левая колонка */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="card lift anim d3">
              <h2>☑ Реестр обещаний</h2>
              <div className="counters">
                <span className="cnt d">Выполнено: {done}</span>
                <span className="cnt w">В работе: {work}</span>
                <span className="cnt l">Просрочено: {late}</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Обещание</th>
                    <th>Срок</th>
                    <th>Прогресс</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {d.promises.map((p) => {
                    const st = STATUS_LABELS[p.status] ?? STATUS_LABELS.pending;
                    return (
                      <tr key={p.id}>
                        <td title={p.verificationSource}>{p.title}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{p.deadline}</td>
                        <td>
                          <span className="prog"><i style={{ width: `${p.progressPercent}%` }} /></span>{" "}
                          {p.progressPercent}%
                        </td>
                        <td><span className={`st ${st.cls}`}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="card lift anim d4">
              <h2>⚖ Работа в парламенте</h2>
              <div className="law-stats">
                <div className="ls">
                  <div className="n t">{d.parliament.attendancePercent}%</div>
                  <div className="l">посещаемость пленарных заседаний</div>
                </div>
                <div className="ls">
                  <div className="n b">{d.parliament.billsIntroduced}</div>
                  <div className="l">законопроектов внесено ({d.parliament.billsAdopted} принято)</div>
                </div>
                <div className="ls">
                  <div className="n g">{d.parliament.appealsHandled}</div>
                  <div className="l">обращений граждан рассмотрено за год</div>
                </div>
              </div>
              <div style={{ fontSize: 13.5, marginBottom: 7, color: "var(--text-2)" }}>
                Последние ключевые голосования депутата:
              </div>
              {d.parliament.keyVotes.map((v, i) => {
                const vl = VOTE_LABELS[v.position];
                return (
                  <div className="vote-row" key={i}>
                    <span className="law">{v.law}</span>
                    <span className="date">{v.date}</span>
                    <span className={`v ${vl.cls}`}>{vl.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="card lift anim d5">
              <h2>↗ Динамика рейтинга (90 дней)</h2>
              <div className="chart-note">Итоговый балл по мере поступления данных и голосов граждан</div>
              <RatingChart points={d.ratingHistory} />
            </div>
          </div>

          {/* Правая колонка */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="card lift anim d3">
              <h2>₽ Доходы и имущество</h2>
              <div className="kv">
                <span className="k">Официальный доход ({d.incomeYear})</span>
                <span className="v2">{d.officialIncome.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="kv">
                <span className="k">Источник</span>
                <span className="v2">Декларация</span>
              </div>
              {d.spouseIncome && (
                <div className="kv">
                  <span className="k">Доход супруга ({d.incomeYear})</span>
                  <span className="v2">{d.spouseIncome.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              <div style={{ height: 12 }} />
              {d.assets.map((a) => (
                <div className="asset" key={a.id}>
                  <span className="ic">{ASSET_ICONS[a.assetType] ?? "◇"}</span>
                  <div>
                    {a.description}
                    {a.source && <div className="src">{a.source}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="card lift anim d4">
              <h2>👥 Народная оценка</h2>
              <div className="q-row">
                <span>Видите улучшения?</span>
                <span className="q-val">{d.people.improvementsYesPercent}% «да»</span>
              </div>
              <div className="q-row">
                <span>Выполняет обещания?</span>
                <span className="q-val">
                  <span className="stars">{stars(d.people.promisesScore)}</span>{" "}
                  {d.people.promisesScore.toFixed(1).replace(".", ",")} / 5
                </span>
              </div>
              <div className="q-row">
                <span>Решение обращений</span>
                <span className="q-val">
                  <span className="stars">{stars(d.people.responseScore)}</span>{" "}
                  {d.people.responseScore.toFixed(1).replace(".", ",")} / 5
                </span>
              </div>
              <div className="q-row">
                <span>Доверие</span>
                <span className="q-val">
                  <span className="stars">{stars(d.people.trustScore)}</span>{" "}
                  {d.people.trustScore.toFixed(1).replace(".", ",")} / 5
                </span>
              </div>
              <div className="q-row">
                <span>Поддержка на выборах</span>
                <span className="q-val">{d.people.supportYesPercent}% «да»</span>
              </div>
              <div style={{ height: 12 }} />
              <div className="chart-note">Проблемы, о которых сообщают граждане:</div>
              {d.people.problems.map((p, i) => (
                <div className="q-row" key={p.category}>
                  <span>{p.category}</span>
                  <span
                    className="q-val"
                    style={{ color: i === 0 ? "var(--bad)" : i === 1 ? "var(--alert)" : "var(--mid)" }}
                  >
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="disclaimer anim d5">
          ⚠ Данные собраны из открытых источников. Обнаруженные несоответствия не являются
          обвинением и требуют проверки. Формула рейтинга и веса блоков открыты — см. страницу{" "}
          <Link href="/how-it-works" style={{ color: "inherit", fontWeight: 600 }}>
            «Как это работает»
          </Link>.
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
