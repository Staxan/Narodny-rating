import { readFileSync } from "node:fs";
import { join } from "node:path";
import PresentationLanding from "@/components/PresentationLanding";

export const metadata = {
  title: "Народный рейтинг — презентация проекта",
  description: "Закрытая презентация проекта Народный рейтинг.",
};

export default function HomePage() {
  const aboutText = readFileSync(join(process.cwd(), "src/content/about-project.md"), "utf8");
  return <PresentationLanding aboutText={aboutText} />;
}

// Основной портал доступен в разделе /demo.
// Пароль тестовой версии проверяется компонентом презентации; перед production
// его нужно заменить на серверную проверку и переменную окружения.
/* */

//
