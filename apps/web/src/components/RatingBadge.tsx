import { scoreArrow, scoreColor } from "@/lib/types";

/** Компактный бейдж рейтинга: цвет + стрелка динамики + балл. */
export default function RatingBadge({ score }: { score: number }) {
  return (
    <span className={`badge ${scoreColor(score)}`}>
      {scoreArrow(score)} {score}
    </span>
  );
}
