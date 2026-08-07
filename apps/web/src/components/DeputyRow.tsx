import Link from "next/link";
import type { Deputy } from "@/lib/types";
import RatingBadge from "./RatingBadge";
import Avatar from "./Avatar";

/** Строка депутата в списках (топ на главной, страница списка). */
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
        <RatingBadge score={d.overallScore} />
        <div className="votes">{d.votesCount.toLocaleString("ru-RU")} голосов</div>
      </div>
    </Link>
  );
}
