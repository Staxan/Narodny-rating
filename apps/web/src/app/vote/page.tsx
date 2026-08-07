import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import VoteFormClient from "@/components/VoteFormClient";
import { DEPUTIES } from "@/lib/mock-data";

/**
 * Страница голосования (Этап 1 — UX-цикл без реального бэкенда).
 * Реальные: вход через Telegram, токены и запись голоса подключаются на этапе API.
 */
export default function VotePage() {
  return (
    <>
      <Navbar active="deputies" />

      <div className="wrap">
        <div className="crumbs anim d1">
          <b>Оценка работы депутата</b>
        </div>

        <div
          className="disclaimer anim d1"
          style={{ marginTop: 12, background: "#ECFDF5", borderColor: "#A7F3D0", color: "#065F46" }}
        >
          🔐 Голосование анонимно и защищено от накруток. Для участия нужен вход через Telegram и
          членство в официальном канале проекта не менее 24 часов.{" "}
          <b>Этап 1: демонстрационный режим — запись голосов будет включена после подключения бэкенда.</b>
        </div>

        <VoteFormClient deputies={DEPUTIES} />
      </div>

      <SiteFooter />
    </>
  );
}
