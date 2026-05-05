/**
 * Servicio de comunicación con la Seller App.
 *
 * En desarrollo, los fetch apuntan a los route handlers locales de Next.js
 * (/api/seller/*) que sirven datos mock.
 * En producción, se apunta a la URL real de la Seller App mediante la
 * variable de entorno SELLER_API_URL.
 *
 * @see docs/03-apis.md — Seller App endpoints
 */

import type {
  ProductListItem,
  ProductListResponse,
  ProductFilters,
  Category,
  ProductDetail,
  Shop,
} from "@/app/lib/types/product";

// ── Configuración ─────────────────────────────────────────────────────────────
/**
 * Base URL de la API.
 * - En desarrollo apunta a los route handlers locales de Next.js.
 * - En producción se reemplaza con la variable de entorno SELLER_API_URL.
 */
const SELLER_BASE_URL =
  process.env.SELLER_API_URL ??
  (process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller`
    : "http://localhost:3000/api/seller");

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * GET /api/seller/productos
 * Devuelve el listado paginado de productos con filtros opcionales.
 */
export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductListResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  // Solo hay una categoría seleccionada por ahora, no hace falta usar category_ids
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

  // Cuando cambie la URL, Next.js actualiza automáticamente el cache
  // y vuelve a ejecutar la función
  const res = await fetch(`${SELLER_BASE_URL}/productos?${params.toString()}`, {
    next: { revalidate: 60 }, // ISR: revalidar cada 60 s
  });

  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

/**
 * GET /api/seller/productos/:product_id
 * Devuelve el detalle completo de un producto.
 */
export async function getProductById(
  product_id: string,
): Promise<ProductDetail | null> {
  const res = await fetch(`${SELLER_BASE_URL}/productos/${product_id}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

/**
 * GET /api/seller/categorias
 * Devuelve el listado de categorías.
 */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${SELLER_BASE_URL}/categorias`, {
    next: { revalidate: 43200 }, // categorías cambian poco: cache de 12 horas
  });
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json(); // CONFIO EN EL CONTRATO CON LA API
}

/**
 * GET /api/seller/shops/:seller_id
 * Devuelve la información pública de la tienda de un vendedor, incluyendo
 * datos generales, categorías en las que publica y el listado paginado
 * de sus productos activos.
 */
export async function getShopById(
  seller_id: string,
  page = 1,
  page_size = 20,
): Promise<Shop | null> {
  const res = await fetch(
    `${SELLER_BASE_URL}/shops/${seller_id}?page=${page}&page_size=${page_size}`,
    {
      next: { revalidate: 60 },
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}

/**
 * Resuelve múltiples productos por id manteniendo el orden recibido.
 * Se usa, por ejemplo, para la pantalla de favoritos.
 */
export async function getProductsByIds(
  productIds: string[],
): Promise<ProductListItem[]> {
  if (productIds.length === 0) return [];

  const uniqueIds = [...new Set(productIds)];

  const details = await Promise.all(
    uniqueIds.map((productId) => getProductById(productId)),
  );

  const byId = new Map(
    details
      .filter((detail): detail is ProductDetail => detail !== null)
      .map((detail) => {
        const product: ProductListItem = {
          product_id: detail.product_id,
          seller_id: detail.seller_id,
          title: detail.title,
          price: detail.price,
          currency: detail.currency,
          category_id: detail.category_id,
          status: detail.status,
          thumbnail_url: detail.thumbnail_url,
          href: detail.href,
        };
        return [product.product_id, product] as const;
      }),
  );

  return uniqueIds
    .map((productId) => byId.get(productId))
    .filter((product): product is ProductListItem => Boolean(product));
}
