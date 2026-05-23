import type { ProductFilters, SortByOption, OrderOption } from "@/app/lib/types/product";
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/constants/pagination";
import type { ParsedFilters, ValidSort } from "./filterParser";

export function nextParamsToURLSearchParams(
  params: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    urlParams.set(key, Array.isArray(value) ? value[0] : value);
  }
  return urlParams;
}

function splitCombinedSort(sort: ValidSort): [SortByOption?, OrderOption?] {
  if (sort === "price_asc") return ["price", "asc"];
  if (sort === "price_desc") return ["price", "desc"];
  if (sort === "newest") return ["created_at", "desc"];
  return [undefined, undefined];
}

export function toProductFilters(
  parsed: ParsedFilters,
  page: number,
  pageSize: number = PRODUCTS_PAGE_SIZE,
  cat?: string,
): ProductFilters {
  const [sort_by, order] = splitCombinedSort(parsed.combinedSort);
  return {
    ...(parsed.searchQuery ? { q: parsed.searchQuery } : {}),
    ...(cat ? { category_id: cat } : {}),
    ...(parsed.maxPrice < 1_000_000 ? { max_price: parsed.maxPrice } : {}),
    ...(parsed.condition ? { condition: parsed.condition } : {}),
    ...(sort_by ? { sort_by, order } : {}),
    page,
    page_size: pageSize,
  };
}
