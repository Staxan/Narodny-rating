import Link from "next/link";
import type { Deputy } from "@/lib/types";
import { totalVotes } from "@/lib/types";
import RatingBadge from "./RatingBadge";
import Avatar from "./Avatar";

/**
 * Строка депутата в списках (топ на главной, страница списка).
 * Основной показатель — Народный рейтинг (сервис называется «Народный рейтинг»);
 * профессиональный рейтинг показан вторичной строкой.
 */
export default function DeputyRow({ d }: { d: Deputy }) {
  return (
    <Link href={`/deputies/${d.slug}`} className="dep-row">
      <Avatar d={d} />
      <div className="dep-info">
        <div className="dep-name">{d.fullName}</div>
        <div className="dep-pos">
          {d.position}
          {d.district ? ` · ${d.district}` : ""}
        </div>
      </div>
      <span className="frac">
        <i style={{ background: d.factionColor }} />
        {d.faction}
      </span>
      <div className="dep-rating">
        <RatingBadge score={d.peopleScore} />
        <div className="votes">
          {totalVotes(d.people).toLocaleString("ru-RU")} голосов · проф. {d.professionalScore}
        </div>
      </div>
    </Link>
  );
}
