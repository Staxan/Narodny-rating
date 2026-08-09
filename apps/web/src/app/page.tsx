import PresentationLanding from "@/components/PresentationLanding";

export const metadata = {
  title: "Народный рейтинг — презентация проекта",
  description: "Закрытая презентация проекта Народный рейтинг.",
};

export default function HomePage() {
  return <PresentationLanding />;
}

// Основной портал доступен в разделе /demo.
// Пароль тестовой версии проверяется компонентом презентации; перед production
// его нужно заменить на серверную проверку и переменную окружения.
/* */

//
