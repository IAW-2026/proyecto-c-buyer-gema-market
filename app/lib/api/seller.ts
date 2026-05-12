/**
 * Cliente HTTP de la Seller App (Layer 4 — External APIs).
 *
 * En desarrollo apunta a los route handlers locales de Next.js (/api/seller/*).
 * En producción se reemplaza con la variable de entorno SELLER_API_URL.
 *
 * @see docs/apis.md — Seller App endpoints
 */

import type {
  ProductListResponse,
  BatchProductResponse,
  ProductFilters,
  Category,
  ProductDetail,
  Shop,
} from "@/app/lib/types/product";

if (!process.env.SELLER_API_URL)
  throw new Error("Missing required environment variable: SELLER_API_URL");

const SELLER_BASE_URL = process.env.SELLER_API_URL;

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductListResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category_id) params.set("category_id", filters.category_id);
  if (filters.min_price !== undefined)
    params.set("min_price", String(filters.min_price));
  if (filters.max_price !== undefined)
    params.set("max_price", String(filters.max_price));
  if (filters.seller_id) params.set("seller_id", filters.seller_id);
  if (filters.status) params.set("status", filters.status);
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.order) params.set("order", filters.order);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));

  const res = await fetch(`${SELLER_BASE_URL}/productos?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

export async function getProductById(
  product_id: string,
): Promise<ProductDetail | null> {
  const res = await fetch(`${SELLER_BASE_URL}/productos/${product_id}`, {
    next: { revalidate: 30 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${SELLER_BASE_URL}/categorias`, {
    next: { revalidate: 43200 },
  });
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

export async function getProductsBatch(
  productIds: string[],
): Promise<BatchProductResponse> {
  if (productIds.length === 0) return { products: [] };

  const res = await fetch(`${SELLER_BASE_URL}/productos/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds }),
  });

  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

export async function getShopById(
  seller_id: string,
  page = 1,
  page_size = 20,
): Promise<Shop | null> {
  const res = await fetch(
    `${SELLER_BASE_URL}/shops/${seller_id}?page=${page}&page_size=${page_size}`,
    { next: { revalidate: 60 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}
