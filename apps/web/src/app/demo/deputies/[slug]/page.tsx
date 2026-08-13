import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ScoreRing from "@/components/ScoreRing";
import RatingBars from "@/components/RatingBars";
import RatingChart from "@/components/RatingChart";
import Avatar from "@/components/Avatar";
import VoteModal from "@/components/VoteModal";
import ParticipantCommunityPanel from "@/components/ParticipantCommunityPanel";
import { getDeputyBySlug } from "@/lib/mock-data";
import { DEPUTIES } from "@/lib/mock-data";
import { LEVEL_NAMES, totalVotes, hasDivergence, scoreCssColor } from "@/lib/types";

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

/** Генерирует карточки всех демонстрационных депутатов при сборке Pages. */
export function generateStaticParams() {
  return DEPUTIES.map((deputy) => ({ slug: deputy.slug }));
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
          <div style={{ width: 190, flexShrink: 0 }}>
            <ScoreRing score={d.peopleScore} votesCount={totalVotes(d.people)} />
            <VoteModal d={d} />
          </div>
        </div>

        {/* Сигнал расхождения двух рейтингов (детектор аномалий) */}
        {hasDivergence(d.professionalScore, d.peopleScore) && (
          <div
            className="anim d3"
            style={{
              marginTop: 18,
              background: "#FFF7ED",
              border: "1px solid #FED7AA",
              color: "#9A3412",
              borderRadius: 12,
              padding: "13px 18px",
              fontSize: 14,
              boxShadow: "var(--sh-sm)",
            }}
          >
            ⚠ <b>Расхождение оценок:</b> профессиональный рейтинг — {d.professionalScore}, народный —{" "}
            {d.peopleScore}. Сильное расхождение между фактическими данными и народной оценкой
            может указывать на накрутку или манипуляцию — данные уходят на проверку.
          </div>
        )}

        {/* Профессиональный рейтинг (объективные данные) — тёмный блок-«герой» */}
        <div className="card card-dark lift anim d3 mt">
          <div className="sec-head" style={{ marginBottom: 10 }}>
            <h2 style={{ margin: 0 }}>▤ Профессиональный рейтинг</h2>
            <span style={{ fontWeight: 500, fontSize: 13, color: "var(--text-2)", marginLeft: "auto" }}>
              открытые источники · голоса людей не влияют ·{" "}
              <Link href="/how-it-works" style={{ color: "var(--accent)" }}>формула v2.0</Link>
            </span>
          </div>

          {/* Итоговая шкала профессионального рейтинга 0–100 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                lineHeight: 1,
                color: scoreCssColor(d.professionalScore),
                minWidth: 64,
              }}
            >
              {d.professionalScore}
            </div>
            <div style={{ flex: 1 }}>
              <div className="bar" style={{ height: 12, borderRadius: 6 }}>
                <i
                  style={{
                    width: `${d.professionalScore}%`,
                    background: `linear-gradient(90deg, ${scoreCssColor(d.professionalScore)}CC, ${scoreCssColor(d.professionalScore)})`,
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#94A3B8", marginTop: 4 }}>
                <span>0</span>
                <span>из 100 · взвешено по 6 блокам</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>Расшифровка по блокам:</div>
          <RatingBars blocks={d.ratingBlocks} />
        </div>

        <div className="grid2">
          {/* Левая колонка */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="card accent-blue lift anim d3">
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

            <div className="card accent-navy lift anim d4">
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

            <div className="card accent-teal lift anim d5">
              <h2>↗ Динамика рейтингов (90 дней)</h2>
              <div className="chart-note">Сравнение двух рейтингов во времени — расхождение сразу видно</div>
              <RatingChart
                series={[
                  { name: "Народный рейтинг", color: "#0D9488", points: d.peopleHistory ?? [] },
                  { name: "Профессиональный рейтинг", color: "#1E293B", points: d.profHistory ?? [] },
                ]}
              />
            </div>
          </div>

          {/* Правая колонка */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="card accent-amber lift anim d3">
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

            <div className="card accent-teal lift anim d4">
              <h2>👥 Народный рейтинг — голоса граждан</h2>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, marginBottom: 6 }}>
                  <span>За</span>
                  <span style={{ fontWeight: 700, color: "var(--good)" }}>{d.people.for.toLocaleString("ru-RU")}</span>
                </div>
                <div className="bar"><i style={{ width: `${(d.people.for / totalVotes(d.people)) * 100}%`, background: "var(--good)" }} /></div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, marginBottom: 6 }}>
                  <span>Против</span>
                  <span style={{ fontWeight: 700, color: "var(--bad)" }}>{d.people.against.toLocaleString("ru-RU")}</span>
                </div>
                <div className="bar"><i style={{ width: `${(d.people.against / totalVotes(d.people)) * 100}%`, background: "var(--bad)" }} /></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, marginBottom: 6 }}>
                  <span>Воздержался</span>
                  <span style={{ fontWeight: 700, color: "var(--text-2)" }}>{d.people.abstain.toLocaleString("ru-RU")}</span>
                </div>
                <div className="bar"><i style={{ width: `${(d.people.abstain / totalVotes(d.people)) * 100}%`, background: "var(--text-2)" }} /></div>
              </div>
              <div className="chart-note" style={{ marginTop: 14 }}>
                Всего подтверждённых голосов: {totalVotes(d.people).toLocaleString("ru-RU")}. Голосование анонимно и защищено от накруток.
              </div>
            </div>
          </div>
        </div>

        <ParticipantCommunityPanel participantName={d.fullName} />

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