import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Народный рейтинг — постоянный общественный контроль за властью",
  description:
    "Проверяемые факты о работе депутатов — обещания, результаты, доходы и имущество — плюс анонимная народная оценка граждан. Защити свой голос от ботов и накруток.",
};

/**
 * Корневой макет приложения.
 * Шрифт Inter подгружается через <link> в head (см. globals.css fallback).
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
