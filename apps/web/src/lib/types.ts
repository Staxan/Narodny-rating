// Типы данных проекта «Народный рейтинг» (Этап 1 — мок-данные)
// Позже будут заменены на ответы API без изменения компонентов.

/** Уровень полномочий участника рейтинга. */
export type DeputyLevel = "federal" | "regional" | "municipal";

/** Универсальная категория участника платформы. */
export type ParticipantCategory = "deputy" | "official" | "institution" | "initiative";

/** Универсальная модель участника: текущий этап использует её для депутатов. */
export type Participant = {
  id: string;
  category: ParticipantCategory;
  fullName: string;
  position: string;
};

export const PARTICIPANT_CATEGORY_NAMES: Record<ParticipantCategory, string> = {
  deputy: "Депутаты",
  official: "Чиновники",
  institution: "Органы и учреждения",
  initiative: "Общественные инициативы",
};

/** Статус обещания */
export type PromiseStatus = "pending" | "in_progress" | "partial" | "fulfilled" | "failed";

/** Позиция депутата в ключевом голосовании */
export type VotePosition = "yea" | "nay" | "abstain" | "absent";

/** Вариант народного голоса */
export type PeopleChoice = "for" | "against" | "abstain";

export interface OfficialPromise {
  id: string;
  title: string;
  deadline: string;
  status: PromiseStatus;
  progressPercent: number;
  verificationSource?: string;
}

export interface DeputyAsset {
  id: string;
  assetType: "real_estate" | "land" | "vehicle" | "share" | "other";
  description: string;
  estimatedValue?: number;
  declared: boolean;
  source?: string;
}

/** Блок профессионального рейтинга (веса из ТЗ 1.1, версия 2.0 — два рейтинга) */
export interface RatingBlock {
  code:
    | "promises"
    | "management"
    | "anticorruption"
    | "budget"
    | "response"
    | "transparency";
  name: string;
  weight: number; // вес в процентах
  score: number | null; // null = нет данных
}

/** Народный рейтинг: голоса «за / против / воздержался» */
export interface PeopleVotes {
  for: number;
  against: number;
  abstain: number;
}

export interface ParliamentWork {
  attendancePercent: number;
  billsIntroduced: number;
  billsAdopted: number;
  appealsHandled: number;
  keyVotes: { law: string; date: string; position: VotePosition }[];
}

export interface Deputy {
  id: string;
  /** Категория участника; пока все демонстрационные записи — депутаты. */
  category?: ParticipantCategory;
  slug: string;
  fullName: string;
  initials: string;
  avatarColor: [string, string]; // градиент аватара (фолбэк, если фото недоступно)
  photoUrl?: string; // URL фотографии (в проде — из официальных источников)
  position: string;
  level: DeputyLevel;
  region: string;
  district?: string; // округ
  faction: string;
  factionColor: string;
  termStart: string;
  termEnd: string;
  committee?: string;
  runsAgainIn2026: boolean; // выдвигается ли повторно на выборах 13.09.2026
  officialIncome: number;
  incomeYear: number;
  spouseIncome?: number;

  /** Профессиональный рейтинг 0–100 (объективные данные, голоса людей не влияют) */
  professionalScore: number;
  /** Народный рейтинг 0–100 (процент голосов «за») */
  peopleScore: number;
  /** Голоса граждан: за / против / воздержался */
  people: PeopleVotes;

  ratingBlocks: RatingBlock[];
  promises: OfficialPromise[];
  assets: DeputyAsset[];
  parliament: ParliamentWork;
  /** Динамика народного рейтинга (90 дней); заполняется расчётным блоком ниже */
  peopleHistory?: { date: string; score: number }[];
  /** Динамика профессионального рейтинга (90 дней); заполняется расчётным блоком ниже */
  profHistory?: { date: string; score: number }[];
}

export interface FeedEvent {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  text: string;
  time: string;
}

/** Цвет бейджа по числовому баллу (пороги из ТЗ 1.1) */
export function scoreColor(score: number): "good" | "mid" | "bad" {
  if (score >= 70) return "good";
  if (score >= 40) return "mid";
  return "bad";
}

/** Цвет текста/бара по баллу (HEX — чтобы корректно работать в градиентах с альфа-суффиксом) */
export function scoreCssColor(score: number): string {
  if (score >= 70) return "#10B981";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

/** Стрелка динамики по баллу */
export function scoreArrow(score: number): string {
  if (score >= 70) return "▲";
  if (score >= 40) return "●";
  return "▼";
}

/** Человекочитаемые названия уровней */
export const LEVEL_NAMES: Record<DeputyLevel, string> = {
  federal: "Государственная дума",
  regional: "Региональный парламент",
  municipal: "Муниципальный уровень",
};

/** Короткие названия уровней для сегментов */
export const LEVEL_SHORT: Record<DeputyLevel, string> = {
  federal: "Госдума",
  regional: "Региональные",
  municipal: "Муниципальные",
};

/** Сумма голосов по депутату */
export function totalVotes(p: PeopleVotes): number {
  return p.for + p.against + p.abstain;
}

/** Народный рейтинг = процент голосов «за» */
export function peopleScore(p: PeopleVotes): number {
  const total = totalVotes(p);
  if (total === 0) return 0;
  return Math.round((p.for / total) * 100);
}

/**
 * Порог расхождения двух рейтингов (пунктов).
 * Если |профессиональный − народный| > порога — показываем сигнал «расхождение оценок».
 */
export const DIVERGENCE_THRESHOLD = 30;

/** Есть ли заметное расхождение между профессиональным и народным рейтингом */
export function hasDivergence(professional: number, people: number): boolean {
  return Math.abs(professional - people) > DIVERGENCE_THRESHOLD;
}
