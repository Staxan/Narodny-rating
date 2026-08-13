import Link from "next/link";
import ExpandedPresentation from "@/components/ExpandedPresentation";
import blocks from "@/content/expanded-presentation.json";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Расширенная презентация — Народный рейтинг",
  description: "Пять смысловых блоков проекта и материалы концепции.",
};

export default function ExpandedPresentationPage() {
  return (
    <div className="presentation-page expanded-page">
      <header className="presentation-nav">
        <Link href="/" className="presentation-logo"><span className="logo-mark">НР</span> Народный рейтинг</Link>
        <nav><Link href="/">Презентация</Link><Link href="/demo">Демо-портал</Link></nav>
      </header>
      <main>
        <div className="expanded-intro wrap">
          <div className="unlock-badge">✦ Расширенная презентация</div>
          <h1>Проект как система<br /><em>общественного участия</em></h1>
          <p>Материалы собраны из рабочих документов проекта и представлены в пяти смысловых блоках.</p>
        </div>
        <ExpandedPresentation blocks={blocks} />
      </main>
      <SiteFooter />
    </div>
  );
}
