// Типы данных проекта «Народный рейтинг» (Этап 1 — мок-данные)
// Позже будут заменены на ответы API без изменения компонентов.

/** Уровень власти депутата */
export type DeputyLevel = "federal" | "regional" | "municipal";

/** Статус обещания */
export type PromiseStatus = "pending" | "in_progress" | "partial" | "fulfilled" | "failed";

/** Позиция депутата в ключевом голосовании */
export type VotePosition = "yea" | "nay" | "abstain" | "absent";

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

/** Блок рейтинга (согласно формуле из ТЗ 1.1) */
export interface RatingBlock {
  code:
    | "promises"
    | "management"
    | "people"
    | "anticorruption"
    | "budget"
    | "response"
    | "transparency";
  name: string;
  weight: number; // вес в процентах
  score: number | null; // null = нет данных
}

export interface PeopleRating {
  improvementsYesPercent: number;
  promisesScore: number; // 1–5
  responseScore: number; // 1–5
  trustScore: number; // 1–5
  supportYesPercent: number;
  problems: { category: string; count: number }[];
  votesCount: number;
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
  overallScore: number;
  votesCount: number;
  ratingBlocks: RatingBlock[];
  promises: OfficialPromise[];
  assets: DeputyAsset[];
  people: PeopleRating;
  parliament: ParliamentWork;
  ratingHistory: { date: string; score: number }[];
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
