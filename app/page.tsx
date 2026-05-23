import { Suspense } from "react";
import ProductGrid from "@/app/components/features/home/ProductGrid";
import { nextParamsToURLSearchParams, toProductFilters } from "@/app/lib/utils/product-filters";
import { parseFiltersFromParams } from "@/app/lib/utils/filterParser";
import ProductGridSkeleton from "@/app/components/products/ProductGridSkeleton";
import { HeaderHomePage } from "@/app/components/features/home/HeaderHomePage";
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/constants/pagination";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function ProductGridSection({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const urlParams = nextParamsToURLSearchParams(params);
  const parsed = parseFiltersFromParams(urlParams);
  const page = Number(params.page) || 1;
  const cat = typeof params.cat === "string" ? params.cat : undefined;
  const filters = toProductFilters(parsed, page, PRODUCTS_PAGE_SIZE, cat);
  return <ProductGrid filters={filters} />;
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="flex-1 w-full">
      {/* == Cabecera ======================================================== */}
      <section id="homepage-header">
        <HeaderHomePage />
      </section>

      {/* == Grilla de Productos ============================================= */}
      <section id="homepage-grid" className="pt-2 pb-8 lgx:pt-3 lgx:pb-7">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGridSection searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
