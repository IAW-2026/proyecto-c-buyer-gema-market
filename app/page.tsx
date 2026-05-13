import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProductGrid from "@/app/components/features/home/ProductGrid";
import { buildFiltersFromParams } from "@/app/lib/utils/product-filters";
import ProductGridSkeleton from "@/app/components/products/ProductGridSkeleton";
import { HeaderHomePage } from "@/app/components/features/home/HeaderHomePage";
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/constants/products";

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

  // page_size es un valor fijo del frontend: si la URL no lo trae o lo trae
  // distinto al valor canónico, redirigimos para que siempre se vea en la URL.
  if (params.page_size !== String(PRODUCTS_PAGE_SIZE)) {
    const fixedParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || key === "page_size") continue;
      if (Array.isArray(value)) {
        for (const v of value) fixedParams.append(key, v);
      } else {
        fixedParams.set(key, value);
      }
    }
    fixedParams.set("page_size", String(PRODUCTS_PAGE_SIZE));
    redirect(`/?${fixedParams.toString()}`);
  }

  const page = Number(params.page) || 1;

  const paginatedParams = {
    ...params,
    page: String(page),
    page_size: String(PRODUCTS_PAGE_SIZE),
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
