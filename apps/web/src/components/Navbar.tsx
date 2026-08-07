import Link from "next/link";

interface NavbarProps {
  /** Активный пункт меню: 'home' | 'deputies' | 'how' | 'support' */
  active?: string;
}

/** Верхняя навигация сайта. Липкая, с эффектом размытия фона. */
export default function Navbar({ active = "" }: NavbarProps) {
  const links = [
    { href: "/", key: "home", label: "Главная" },
    { href: "/deputies", key: "deputies", label: "Депутаты" },
    { href: "/how-it-works", key: "how", label: "Как это работает" },
    { href: "/support", key: "support", label: "Поддержать" },
  ];

  return (
    <nav className="navbar">
      <div className="wrap nav-inner">
        <Link href="/" className="logo">
          <span className="logo-mark">НР</span> Народный рейтинг
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className={active === l.key ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <Link href="/vote" className="btn">
            ✈ Войти через Telegram
          </Link>
        </div>
      </div>
    </nav>
  );
}
