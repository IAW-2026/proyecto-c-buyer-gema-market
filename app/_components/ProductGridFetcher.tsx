import ProductGrid from "./ProductGrid";
import { nextParamsToURLSearchParams, toProductFilters } from "@/app/lib/utils/product-filters";
import { parseFiltersFromParams } from "@/app/lib/utils/filterParser";
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/constants/pagination";

interface ProductGridFetcherProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function ProductGridFetcher({ searchParams }: ProductGridFetcherProps) {
  const params = await searchParams;
  const urlParams = nextParamsToURLSearchParams(params);
  const parsed = parseFiltersFromParams(urlParams);
  const page = Number(params.page) || 1;
  const cat = typeof params.cat === "string" ? params.cat : undefined;
  const filters = toProductFilters(parsed, page, PRODUCTS_PAGE_SIZE, cat);
  return <ProductGrid filters={filters} />;
}
