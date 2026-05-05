import { Suspense } from "react";
import ProductGrid, {
  buildFiltersFromParams,
} from "@/app/components/features/home/ProductGrid";
import ProductGridSkeleton from "@/app/components/products/ProductGridSkeleton";
import { HeaderHomePage } from "@/app/components/features/home/HeaderHomePage";

/**
 * Home page — Catálogo de productos.
 *
 * Arquitectura de datos:
 *  • La barra de navegación y el footer se renderizan en layout.tsx.
 *  • FilterDrawerServer (Server) carga categorías y monta FilterDrawer (Client).
 *  • FilterDrawer actualiza la URL al aplicar filtros → Next.js re-renderiza
 *    ProductGrid con los nuevos searchParams en una única query a la API/BD.
 *  • ProductGrid está en su propio <Suspense>: muestra skeleton mientras carga,
 *    mientras que el botón y el título ya están visibles (streaming SSR).
 *
 * searchParams: Next.js los inyecta automáticamente en page components.
 */
interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const pageSize = Number(params.page_size) || 4;

  // Agregar a params y pasar a buildFiltersFromParams
  const paginatedParams = {
    ...params,
    page: String(page),
    page_size: String(pageSize),
  };
  const filters = buildFiltersFromParams(paginatedParams);

  return (
    <div className="flex-1 w-full">
      {/* == Cabecera ======================================================== */}
      <section id="homepage-header">
        <HeaderHomePage />
      </section>

      {/* == Grilla de Productos ============================================= */}
      {/*
       * ProductGrid está en su propio Suspense para hacer streaming SSR:
       * el skeleton aparece mientras resuelve getProducts()
       */}
      <section id="homepage-grid" className="pt-2 pb-8 lgx:pt-3 lgx:pb-7">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid filters={filters} />
        </Suspense>
      </section>
    </div>
  );
}
