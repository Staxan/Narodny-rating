// Мок-данные проекта «Народный рейтинг» (Этап 1).
// Все данные вымышленные и служат только для отработки интерфейса.
// Позже заменяются ответами API без изменения компонентов.

import type { Deputy, DeputyLevel, FeedEvent, RatingBlock } from "./types";

/** Стандартные блоки рейтинга (веса из ТЗ 1.1). score = null — нет данных. */
function blocks(scores: Partial<Record<RatingBlock["code"], number | null>>): RatingBlock[] {
  return [
    { code: "promises", name: "Выполнение обещаний", weight: 25, score: scores.promises ?? null },
    { code: "management", name: "Управленческий результат", weight: 20, score: scores.management ?? null },
    { code: "people", name: "Народная оценка", weight: 20, score: scores.people ?? null },
    { code: "anticorruption", name: "Антикоррупционная чистота", weight: 15, score: scores.anticorruption ?? null },
    { code: "budget", name: "Бюджетная дисциплина", weight: 10, score: scores.budget ?? null },
    { code: "response", name: "Реакция на проблемы", weight: 5, score: scores.response ?? null },
    { code: "transparency", name: "Прозрачность", weight: 5, score: scores.transparency ?? null },
  ];
}

/** Итоговый балл = средневзвешенное по заполненным блокам (формула Этапа 1). */
export function computeOverall(bs: RatingBlock[]): number {
  const filled = bs.filter((b) => b.score !== null);
  if (filled.length <= 1) return 0;
  const sumW = filled.reduce((s, b) => s + b.weight, 0);
  const sum = filled.reduce((s, b) => s + (b.score as number) * b.weight, 0);
  return Math.round(sum / sumW);
}

/** Небольшой «шум» для графика динамики вокруг базового балла. */
function history(base: number, trend = 0): { date: string; score: number }[] {
  const points: { date: string; score: number }[] = [];
  const months = ["08.05", "15.05", "22.05", "29.05", "05.06", "12.06", "19.06", "26.06", "03.07", "10.07", "17.07", "24.07", "31.07", "07.08"];
  const deltas = [-4, -2, -3, 0, 1, -1, 2, 3, 2, 4, 3, 5, 4, 0];
  months.forEach((date, i) => {
    const v = Math.max(5, Math.min(95, base + trend * (i / months.length) + deltas[i]));
    points.push({ date, score: Math.round(v) });
  });
  return points;
}

export const DEPUTIES: Deputy[] = [
  {
    id: "d-romanova",
    slug: "romanova-anna",
    fullName: "Романова Анна Викторовна",
    initials: "РА",
    avatarColor: ["#818CF8", "#4338CA"],
    position: "Депутат Государственной думы VIII созыва",
    level: "federal",
    region: "г. Москва",
    district: "Округ № 205, г. Москва",
    faction: "КПРФ",
    factionColor: "#EF4444",
    termStart: "19.09.2021",
    termEnd: "сентябрь 2026",
    committee: "по труду, социальной политике и делам ветеранов",
    runsAgainIn2026: true,
    officialIncome: 5_820_000,
    incomeYear: 2025,
    spouseIncome: 1_140_000,
    overallScore: 0,
    votesCount: 1103,
    ratingBlocks: blocks({ promises: 52, management: 58, people: 49, budget: 61, response: 71, transparency: 66 }),
    promises: [
      { id: "p1", title: "Индексация МРОТ выше инфляции", deadline: "01.01.2026", status: "fulfilled", progressPercent: 100, verificationSource: "Федеральный закон от 28.12.2025" },
      { id: "p2", title: "Приёмная в округе № 205 — еженедельные встречи", deadline: "постоянно", status: "fulfilled", progressPercent: 100, verificationSource: "График приёмной, фотоотчёты" },
      { id: "p3", title: "Законопроект о поддержке многодетных семей", deadline: "01.07.2026", status: "in_progress", progressPercent: 60, verificationSource: "Карточка законопроекта в ГАС «Законотворчество»" },
      { id: "p4", title: "Капремонт 4 поликлиник округа", deadline: "01.12.2025", status: "failed", progressPercent: 35, verificationSource: "Данные портала госзакупок" },
      { id: "p5", title: "Программа занятости молодёжи в округе", deadline: "01.09.2025", status: "failed", progressPercent: 20, verificationSource: "Отчёт администрации округа" },
      { id: "p6", title: "Мониторинг цен на лекарства", deadline: "01.06.2026", status: "in_progress", progressPercent: 55, verificationSource: "Публикации депутата" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 96 м² — собственность", declared: true, source: "Росреестр · из декларации" },
      { id: "a2", assetType: "land", description: "Земельный участок 12 соток", declared: true, source: "Росреестр · из декларации" },
      { id: "a3", assetType: "vehicle", description: "Автомобиль Toyota Camry, 2023", declared: true, source: "Декларация" },
      { id: "a4", assetType: "share", description: "Доля 25% в ООО «Вектор-Плюс»", declared: false, source: "Реестр юрлиц · открытые данные" },
    ],
    people: {
      improvementsYesPercent: 41,
      promisesScore: 2.8,
      responseScore: 3.2,
      trustScore: 2.9,
      supportYesPercent: 38,
      problems: [
        { category: "Медицина", count: 34 },
        { category: "Социальная поддержка", count: 22 },
        { category: "ЖКХ", count: 17 },
      ],
      votesCount: 1103,
    },
    parliament: {
      attendancePercent: 78,
      billsIntroduced: 14,
      billsAdopted: 3,
      appealsHandled: 96,
      keyVotes: [
        { law: "О федеральном бюджете на 2026 год", date: "21.11.2025", position: "nay" },
        { law: "Об индексации пенсий работающим пенсионерам", date: "14.10.2025", position: "yea" },
        { law: "О поддержке многодетных семей (II чтение)", date: "03.09.2025", position: "yea" },
        { law: "О регулировании дистанционной занятости", date: "17.06.2025", position: "absent" },
      ],
    },
    ratingHistory: history(52, +3),
  },
  {
    id: "d-sokolova",
    slug: "sokolova-olga",
    fullName: "Соколова Ольга Дмитриевна",
    initials: "СО",
    avatarColor: ["#14B8A6", "#0F766E"],
    position: "Депутат городской думы Екатеринбурга",
    level: "municipal",
    region: "Свердловская область",
    district: "Округ № 7, г. Екатеринбург",
    faction: "Новые люди",
    factionColor: "#0D9488",
    termStart: "10.09.2023",
    termEnd: "сентябрь 2028",
    committee: "по городскому хозяйству",
    runsAgainIn2026: false,
    officialIncome: 2_140_000,
    incomeYear: 2025,
    overallScore: 0,
    votesCount: 2314,
    ratingBlocks: blocks({ promises: 88, management: 82, people: 84, budget: 79, response: 90, transparency: 85 }),
    promises: [
      { id: "p1", title: "Ремонт 20 км дорог района", deadline: "01.10.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Акты работ, фотофиксация" },
      { id: "p2", title: "Благоустройство 12 дворов", deadline: "01.09.2026", status: "in_progress", progressPercent: 66, verificationSource: "Отчёт администрации" },
      { id: "p3", title: "Модернизация 3 школ округа", deadline: "01.09.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Акты ввода объектов" },
      { id: "p4", title: "Новые остановки транспорта (40 шт.)", deadline: "01.05.2025", status: "failed", progressPercent: 55, verificationSource: "Данные перевозчика" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 62 м² — собственность", declared: true, source: "Росреестр · из декларации" },
      { id: "a2", assetType: "vehicle", description: "Автомобиль Lada Vesta, 2022", declared: true, source: "Декларация" },
    ],
    people: {
      improvementsYesPercent: 74,
      promisesScore: 4.4,
      responseScore: 4.2,
      trustScore: 4.5,
      supportYesPercent: 81,
      problems: [
        { category: "Дороги", count: 12 },
        { category: "ЖКХ", count: 9 },
        { category: "Благоустройство", count: 6 },
      ],
      votesCount: 2314,
    },
    parliament: {
      attendancePercent: 94,
      billsIntroduced: 9,
      billsAdopted: 6,
      appealsHandled: 143,
      keyVotes: [
        { law: "О бюджете города на 2026 год", date: "18.12.2025", position: "yea" },
        { law: "О программе ремонта дворов", date: "22.05.2025", position: "yea" },
        { law: "О повышении тарифов на вывоз мусора", date: "11.03.2025", position: "nay" },
      ],
    },
    ratingHistory: history(80, +5),
  },
  {
    id: "d-kovalev",
    slug: "kovalev-mikhail",
    fullName: "Ковалёв Михаил Андреевич",
    initials: "КМ",
    avatarColor: ["#F87171", "#B91C1C"],
    position: "Депутат Законодательного собрания Свердловской области",
    level: "regional",
    region: "Свердловская область",
    district: "Округ № 12",
    faction: "КПРФ",
    factionColor: "#EF4444",
    termStart: "11.09.2022",
    termEnd: "сентябрь 2027",
    committee: "по бюджету и налогам",
    runsAgainIn2026: true,
    officialIncome: 3_460_000,
    incomeYear: 2025,
    overallScore: 0,
    votesCount: 1877,
    ratingBlocks: blocks({ promises: 74, management: 71, people: 76, budget: 68, response: 80, transparency: 72 }),
    promises: [
      { id: "p1", title: "Ремонт школ в 5 сельских территориях", deadline: "01.09.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Акты приёмки" },
      { id: "p2", title: "Льготный проезд для пенсионеров", deadline: "01.01.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Закон Свердловской области" },
      { id: "p3", title: "Газификация 3 посёлков", deadline: "01.12.2026", status: "in_progress", progressPercent: 40, verificationSource: "Программа газификации" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Дом 140 м² — собственность", declared: true, source: "Росреестр · из декларации" },
      { id: "a2", assetType: "vehicle", description: "Автомобиль УАЗ Патриот, 2020", declared: true, source: "Декларация" },
    ],
    people: {
      improvementsYesPercent: 62,
      promisesScore: 3.9,
      responseScore: 4.0,
      trustScore: 3.8,
      supportYesPercent: 69,
      problems: [
        { category: "ЖКХ", count: 18 },
        { category: "Транспорт", count: 11 },
      ],
      votesCount: 1877,
    },
    parliament: {
      attendancePercent: 88,
      billsIntroduced: 21,
      billsAdopted: 8,
      appealsHandled: 112,
      keyVotes: [
        { law: "Об областном бюджете на 2026 год", date: "09.12.2025", position: "nay" },
        { law: "О льготах на проезд пенсионерам", date: "14.11.2024", position: "yea" },
      ],
    },
    ratingHistory: history(73, +3),
  },
  {
    id: "d-ivanov",
    slug: "ivanov-sergey",
    fullName: "Иванов Сергей Петрович",
    initials: "ИП",
    avatarColor: ["#60A5FA", "#1D4ED8"],
    position: "Депутат Московской городской думы",
    level: "regional",
    region: "г. Москва",
    district: "Округ № 14, г. Москва",
    faction: "Единая Россия",
    factionColor: "#3B82F6",
    termStart: "08.09.2024",
    termEnd: "сентябрь 2029",
    committee: "по здравоохранению",
    runsAgainIn2026: false,
    officialIncome: 4_980_000,
    incomeYear: 2025,
    spouseIncome: 890_000,
    overallScore: 0,
    votesCount: 1447,
    ratingBlocks: blocks({ promises: 58, management: 65, people: 61, budget: 52, response: 70, transparency: 75 }),
    promises: [
      { id: "p1", title: "Открыть новую поликлинику в округе", deadline: "31.12.2025", status: "failed", progressPercent: 45, verificationSource: "Данные стройнадзора" },
      { id: "p2", title: "Дополнительные группы в детсадах", deadline: "01.09.2026", status: "in_progress", progressPercent: 70, verificationSource: "Отчёт департамента образования" },
      { id: "p3", title: "Пешеходные переходы у 8 школ", deadline: "01.06.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Схема организации движения" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 74 м² — доля 1/2", declared: true, source: "Росреестр · из декларации" },
      { id: "a2", assetType: "land", description: "Земельный участок 8 соток", declared: true, source: "Росреестр · из декларации" },
      { id: "a3", assetType: "vehicle", description: "Автомобиль Skoda Octavia, 2021", declared: true, source: "Декларация" },
    ],
    people: {
      improvementsYesPercent: 64,
      promisesScore: 3.4,
      responseScore: 3.1,
      trustScore: 3.3,
      supportYesPercent: 57,
      problems: [
        { category: "ЖКХ", count: 41 },
        { category: "Дороги", count: 27 },
        { category: "Медицина", count: 19 },
      ],
      votesCount: 1447,
    },
    parliament: {
      attendancePercent: 82,
      billsIntroduced: 6,
      billsAdopted: 2,
      appealsHandled: 88,
      keyVotes: [
        { law: "О бюджете г. Москвы на 2026 год", date: "17.12.2025", position: "yea" },
        { law: "О реновации квартала 14-Б", date: "30.10.2025", position: "yea" },
      ],
    },
    ratingHistory: history(60, +2),
  },
  {
    id: "d-gusev",
    slug: "gusev-viktor",
    fullName: "Гусев Виктор Николаевич",
    initials: "ГВ",
    avatarColor: ["#FB923C", "#C2410C"],
    position: "Депутат Совета депутатов г. о. Химки",
    level: "municipal",
    region: "Московская область",
    district: "Округ № 3, г. о. Химки",
    faction: "СРЗП",
    factionColor: "#F97316",
    termStart: "12.09.2023",
    termEnd: "сентябрь 2026",
    committee: "по ЖКХ и благоустройству",
    runsAgainIn2026: true,
    officialIncome: 1_780_000,
    incomeYear: 2025,
    overallScore: 0,
    votesCount: 986,
    ratingBlocks: blocks({ promises: 28, management: 34, people: 31, budget: 40, response: 25, transparency: 38 }),
    promises: [
      { id: "p1", title: "Ремонт кровель 6 домов", deadline: "01.10.2024", status: "failed", progressPercent: 15, verificationSource: "Обращения жителей, акты" },
      { id: "p2", title: "Детская площадка в мкр. Сходня", deadline: "01.06.2025", status: "in_progress", progressPercent: 30, verificationSource: "Фотофиксация" },
      { id: "p3", title: "Освещение пешеходных дорожек", deadline: "01.12.2024", status: "failed", progressPercent: 0, verificationSource: "Отчёт администрации" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 58 м² — собственность", declared: true, source: "Росреестр · из декларации" },
    ],
    people: {
      improvementsYesPercent: 22,
      promisesScore: 1.9,
      responseScore: 2.2,
      trustScore: 2.0,
      supportYesPercent: 18,
      problems: [
        { category: "ЖКХ", count: 56 },
        { category: "Благоустройство", count: 31 },
        { category: "Безопасность", count: 12 },
      ],
      votesCount: 986,
    },
    parliament: {
      attendancePercent: 61,
      billsIntroduced: 2,
      billsAdopted: 0,
      appealsHandled: 24,
      keyVotes: [
        { law: "О бюджете городского округа на 2026 год", date: "20.11.2025", position: "yea" },
        { law: "О повышении тарифов ЖКХ", date: "12.02.2025", position: "yea" },
      ],
    },
    ratingHistory: history(33, -4),
  },
  {
    id: "d-petrova",
    slug: "petrova-elena",
    fullName: "Петрова Елена Сергеевна",
    initials: "ПЕ",
    avatarColor: ["#34D399", "#047857"],
    position: "Депутат Государственной думы VIII созыва",
    level: "federal",
    region: "Санкт-Петербург",
    district: "Округ № 217, г. Санкт-Петербург",
    faction: "Единая Россия",
    factionColor: "#3B82F6",
    termStart: "19.09.2021",
    termEnd: "сентябрь 2026",
    committee: "по образованию и науке",
    runsAgainIn2026: true,
    officialIncome: 6_240_000,
    incomeYear: 2025,
    spouseIncome: 2_300_000,
    overallScore: 0,
    votesCount: 1622,
    ratingBlocks: blocks({ promises: 71, management: 74, people: 68, budget: 77, response: 65, transparency: 70 }),
    promises: [
      { id: "p1", title: "Капремонт 12 школьных спортзалов", deadline: "01.09.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Акты приёмки" },
      { id: "p2", title: "Программа горячего питания в школах", deadline: "01.09.2024", status: "fulfilled", progressPercent: 100, verificationSource: "Данные Рособрнадзора" },
      { id: "p3", title: "IT-классы в 8 школах округа", deadline: "01.09.2026", status: "in_progress", progressPercent: 50, verificationSource: "Отчёт комитета по образованию" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 104 м² — собственность", declared: true, source: "Росреестр · из декларации" },
      { id: "a2", assetType: "real_estate", description: "Дача 86 м² — собственность", declared: true, source: "Росреестр · из декларации" },
      { id: "a3", assetType: "vehicle", description: "Автомобиль Kia Sportage, 2024", declared: true, source: "Декларация" },
    ],
    people: {
      improvementsYesPercent: 59,
      promisesScore: 3.7,
      responseScore: 3.5,
      trustScore: 3.6,
      supportYesPercent: 62,
      problems: [
        { category: "Образование", count: 15 },
        { category: "Медицина", count: 12 },
      ],
      votesCount: 1622,
    },
    parliament: {
      attendancePercent: 91,
      billsIntroduced: 18,
      billsAdopted: 7,
      appealsHandled: 134,
      keyVotes: [
        { law: "О федеральном бюджете на 2026 год", date: "21.11.2025", position: "yea" },
        { law: "Об основах государственной политики в сфере образования", date: "02.07.2025", position: "yea" },
      ],
    },
    ratingHistory: history(69, +4),
  },
  {
    id: "d-volkov",
    slug: "volkov-dmitry",
    fullName: "Волков Дмитрий Александрович",
    initials: "ВД",
    avatarColor: ["#FBBF24", "#B45309"],
    position: "Депутат Законодательного собрания Пермского края",
    level: "regional",
    region: "Пермский край",
    district: "Округ № 9, г. Пермь",
    faction: "ЛДПР",
    factionColor: "#6366F1",
    termStart: "13.09.2021",
    termEnd: "сентябрь 2026",
    committee: " по промышленности и предпринимательству",
    runsAgainIn2026: true,
    officialIncome: 3_120_000,
    incomeYear: 2025,
    overallScore: 0,
    votesCount: 743,
    ratingBlocks: blocks({ promises: 45, management: 51, people: 44, budget: 55, response: 48, transparency: 41 }),
    promises: [
      { id: "p1", title: "Поддержка малого бизнеса: субсидии", deadline: "01.07.2025", status: "partial", progressPercent: 60, verificationSource: "Отчёт минэкономразвития края" },
      { id: "p2", title: "Ремонт моста через Каму", deadline: "01.12.2025", status: "in_progress", progressPercent: 45, verificationSource: "Данные подрядчика" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 81 м² — собственность", declared: true, source: "Росреестр · из декларации" },
      { id: "a2", assetType: "share", description: "Доля 40% в ООО «УралТрейд»", declared: true, source: "Реестр юрлиц · из декларации" },
      { id: "a3", assetType: "vehicle", description: "Автомобиль BMW X3, 2022", declared: true, source: "Декларация" },
    ],
    people: {
      improvementsYesPercent: 38,
      promisesScore: 2.9,
      responseScore: 3.0,
      trustScore: 2.7,
      supportYesPercent: 35,
      problems: [
        { category: "Дороги", count: 22 },
        { category: "Экономика", count: 14 },
      ],
      votesCount: 743,
    },
    parliament: {
      attendancePercent: 72,
      billsIntroduced: 8,
      billsAdopted: 2,
      appealsHandled: 61,
      keyVotes: [
        { law: "О бюджете Пермского края на 2026 год", date: "04.12.2025", position: "nay" },
        { law: "О налоговых льготах для МСП", date: "19.06.2025", position: "yea" },
      ],
    },
    ratingHistory: history(46, +1),
  },
  {
    id: "d-nikitina",
    slug: "nikitina-maria",
    fullName: "Никитина Мария Игоревна",
    initials: "НМ",
    avatarColor: ["#F472B6", "#BE185D"],
    position: "Депутат Городской думы Нижнего Новгорода",
    level: "municipal",
    region: "Нижегородская область",
    district: "Округ № 5, г. Нижний Новгород",
    faction: "Новые люди",
    factionColor: "#0D9488",
    termStart: "10.09.2023",
    termEnd: "сентябрь 2028",
    committee: "по социальным вопросам",
    runsAgainIn2026: false,
    officialIncome: 1_960_000,
    incomeYear: 2025,
    overallScore: 0,
    votesCount: 1204,
    ratingBlocks: blocks({ promises: 77, management: 70, people: 73, budget: 66, response: 84, transparency: 79 }),
    promises: [
      { id: "p1", title: "Центр поддержки пожилых людей в округе", deadline: "01.03.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Открытие центра, фотоотчёт" },
      { id: "p2", title: "Доступная среда: пандусы в 20 учреждениях", deadline: "01.09.2026", status: "in_progress", progressPercent: 65, verificationSource: "Реестр объектов" },
      { id: "p3", title: "Программа наставничества для подростков", deadline: "01.06.2025", status: "fulfilled", progressPercent: 100, verificationSource: "Отчёт НКО-партнёров" },
    ],
    assets: [
      { id: "a1", assetType: "real_estate", description: "Квартира 54 м² — доля 1/3", declared: true, source: "Росреестр · из декларации" },
    ],
    people: {
      improvementsYesPercent: 68,
      promisesScore: 4.1,
      responseScore: 4.4,
      trustScore: 4.2,
      supportYesPercent: 74,
      problems: [
        { category: "Социальная поддержка", count: 9 },
        { category: "Доступная среда", count: 7 },
      ],
      votesCount: 1204,
    },
    parliament: {
      attendancePercent: 96,
      billsIntroduced: 11,
      billsAdopted: 5,
      appealsHandled: 167,
      keyVotes: [
        { law: "О бюджете города на 2026 год", date: "16.12.2025", position: "yea" },
        { law: "О социальных выплатах многодетным", date: "25.09.2025", position: "yea" },
      ],
    },
    ratingHistory: history(72, +4),
  },
];

// Итоговые баллы считаются по формуле из блоков — единый источник истины
DEPUTIES.forEach((d) => {
  d.overallScore = computeOverall(d.ratingBlocks);
});

/** Лента последних изменений для главной страницы */
export const FEED_EVENTS: FeedEvent[] = [
  {
    id: "f1",
    icon: "✓",
    iconBg: "#CCFBF1",
    iconColor: "#0D9488",
    text: "Обещание «Ремонт 20 км дорог» отмечено как <b>выполнено</b> — Соколова О. Д.",
    time: "12 минут назад",
  },
  {
    id: "f2",
    icon: "＋",
    iconBg: "#DBEAFE",
    iconColor: "#3B82F6",
    text: "Подтверждено <b>47 новых голосов</b> за последний час",
    time: "1 час назад",
  },
  {
    id: "f3",
    icon: "◷",
    iconBg: "#FEF3C7",
    iconColor: "#F59E0B",
    text: "Обещание «Открыть поликлинику» — <b>просрочено</b> — Иванов С. П.",
    time: "3 часа назад",
  },
  {
    id: "f4",
    icon: "₽",
    iconBg: "#FFE4E6",
    iconColor: "#EF4444",
    text: "Загружены данные декларации о доходах за 2025 год — Романова А. В.",
    time: "вчера",
  },
];

/** Общая статистика для главной */
export const OVERVIEW_STATS = {
  deputiesCount: DEPUTIES.length,
  votesCount: DEPUTIES.reduce((s, d) => s + d.votesCount, 0),
  regionsCount: new Set(DEPUTIES.map((d) => d.region)).size,
};

export function getDeputyBySlug(slug: string): Deputy | undefined {
  return DEPUTIES.find((d) => d.slug === slug);
}

export function getLevelCounts(): Record<DeputyLevel, number> {
  return {
    federal: DEPUTIES.filter((d) => d.level === "federal").length,
    regional: DEPUTIES.filter((d) => d.level === "regional").length,
    municipal: DEPUTIES.filter((d) => d.level === "municipal").length,
  };
}
