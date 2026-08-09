import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import DeputyListClient from "@/components/DeputyListClient";
import { DEPUTIES } from "@/lib/mock-data";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Страница списка депутатов с фильтрами и поиском (ТЗ 1.1, раздел 5.2).
 * Поддерживает URL-параметры из фильтров главной: level, region, faction, q, rating.
 */
export default async function DeputiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;

  return (
    <>
      <Navbar active="deputies" />
      <div style={{ paddingTop: 10 }}>
        <DeputyListClient
          deputies={DEPUTIES}
          initial={{
            level: first(params.level),
            region: first(params.region),
            faction: first(params.faction),
            q: first(params.q),
            rating: first(params.rating),
          }}
        />
      </div>
      <SiteFooter />
    </>
  );
}