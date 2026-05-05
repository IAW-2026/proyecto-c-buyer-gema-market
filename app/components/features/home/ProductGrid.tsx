/**
 * ProductGrid
 *
 * Server Component asíncrono que recibe filtros (derivados de searchParams en
 * page.tsx) y llama a getProducts() para renderizar la grilla.
 *
 * Al estar envuelto en <Suspense>, Next.js hace streaming SSR:
 * muestra ProductGridSkeleton mientras la promesa resuelve.
 */

import type {
  ProductFilters,
  SortByOption,
  OrderOption,
  ProductStatus,
} from "@/app/lib/types/product";
import { getProducts } from "@/app/lib/services/seller";
import Pagination from "./Pagination";
import ProductCard from "../../products/ProductCard";

interface ProductGridProps {
  filters: ProductFilters;
}

export default async function ProductGrid({ filters }: ProductGridProps) {
  const { items, total, page_size } = await getProducts(filters);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <svg
          className="h-12 w-12 text-line-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <p className="text-sm font-medium text-ink-3">
          No encontramos productos con esos filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 pb-5 lgx:mx-auto lgx:w-full lgx:max-w-295 lgx:px-7 lgx:pt-2 lgx:pb-7">
      <p className="text-xs font-mono text-ink-3">
        {total} {total === 1 ? "resultado" : "resultados"} encontrados
      </p>
      <div
        id="product-grid"
        className="grid gap-3 lgx:gap-4.5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lgx:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
      >
        {items.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>

      {/* Paginación, se decidio meter aqui el componente Pagination
        debido a que para saber el total de paginas, si o si debemos pedir los productos
        primero, y esto es por como creamos la api de productos
      */}
      <section id="homepage-pagination" className="flex justify-center py-12">
        <Pagination totalPages={Math.ceil(total / page_size)} />
      </section>
    </div>
  );
}

// ── Helper: convierte searchParams → ProductFilters ────────────────────────────
/**
 * buildFiltersFromParams
 * ──────────────────────
 * Transforma los parámetros crudos de la URL en un objeto ProductFilters tipado.
 * Se llama en page.tsx para derivar los filtros desde Next.js searchParams.
 *
 * ¿Por qué existe esta función?
 * Next.js entrega searchParams con el tipo:
 *   Record<string, string | string[] | undefined>
 *
 * Cada valor puede ser:
 *   - string        → ?sort=price_asc
 *   - undefined     → el param no existe en la URL
 *
 * getProducts() en cambio espera un ProductFilters bien tipado.
 * Esta función es el puente entre los dos mundos.
 */
export function buildFiltersFromParams(
  params: Record<string, string | string[] | undefined>,
): ProductFilters {
  // ── 1. Categorías (?cat=ropa)
  const rawCat = params["cat"];

  const category_id: string | undefined =
    typeof rawCat === "string" ? rawCat : undefined;

  // ── 2. Ordenamiento (?sort_by=price&order=asc) ───────────────────────────
  const rawSortBy = params["sort_by"];
  const rawOrder = params["order"];

  const sort_by = (Array.isArray(rawSortBy) ? rawSortBy[0] : rawSortBy) as
    | SortByOption
    | undefined;
  const order = (Array.isArray(rawOrder) ? rawOrder[0] : rawOrder) as
    | OrderOption
    | undefined;

  // ── 3. Búsqueda por texto (?q=zapatillas) ─────────────────────────────────
  /**
   * "q" también es un valor único. Mismo tratamiento que sort:
   * si llegara como array tomamos solo el primer elemento.
   *
   * Ejemplos:
   *   ?q=zapatillas → params["q"] = "zapatillas" → "zapatillas"
   *   (sin ?q)      → params["q"] = undefined    → undefined
   */
  const rawQ = params["q"];

  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ;

  // ── 4. Precio (?min_price=100&max_price=500) ──────────────────────────────
  const rawMin = params["min_price"];
  const rawMax = params["max_price"];
  const min_price = rawMin
    ? Number(Array.isArray(rawMin) ? rawMin[0] : rawMin)
    : undefined;
  const max_price = rawMax
    ? Number(Array.isArray(rawMax) ? rawMax[0] : rawMax)
    : undefined;

  // ── 5. Estado / Condición (?status=new) ───────────────────────────────────
  const rawStatus = params["status"];
  const status = (Array.isArray(rawStatus) ? rawStatus[0] : rawStatus) as
    | ProductStatus
    | undefined;

  // ── 6. Paginación (?page=1&page_size=20) ───────────────────────────────────
  const rawPage = params["page"];
  const page = Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1;
  const rawPageSize = params["page_size"];
  const pageSize =
    Number(Array.isArray(rawPageSize) ? rawPageSize[0] : rawPageSize) || 20;

  // ── 7. Construir el objeto final omitiendo claves vacías ──────────────────
  return {
    ...(q ? { q } : {}),
    ...(category_id ? { category_id } : {}),
    ...(min_price !== undefined ? { min_price } : {}),
    ...(max_price !== undefined ? { max_price } : {}),
    ...(status ? { status } : {}),
    ...(sort_by ? { sort_by } : {}),
    ...(order ? { order } : {}),
    ...(page ? { page } : {}),
    ...(pageSize ? { page_size: pageSize } : {}),
  };
}
