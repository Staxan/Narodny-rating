import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import DeputyListClient from "@/components/DeputyListClient";
import { DEPUTIES } from "@/lib/mock-data";

/**
 * Страница списка депутатов с фильтрами и поиском (ТЗ 1.1, раздел 5.2).
 * Фильтры применяются на клиенте по мок-данным.
 */
export default function DeputiesPage() {
  return (
    <>
      <Navbar active="deputies" />
      <div style={{ paddingTop: 10 }}>
        <DeputyListClient
          deputies={DEPUTIES}
        />
      </div>
      <SiteFooter />
    </>
  );
}