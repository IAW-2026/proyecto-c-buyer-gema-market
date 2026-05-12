/**
 * Tipos de producto según la documentación de la Seller App.
 * @see docs/03-apis.md  — GET /api/seller/productos
 * @see docs/04-modelo-de-datos.md — entidad `producto`
 *
 * Convención: todos los campos en snake_case (per docs/03-apis.md).
 */

// ── Estado del producto (ahora usado para la condición: nuevo/usado) ─────────
export type ProductStatus = "new" | "used";

// ── Respuesta del listado: GET /api/seller/productos ──────────────────────────
/** Ítem de producto tal como llega del endpoint de listado de la Seller App. */
export interface ProductListItem {
  product_id: string;
  seller_id: string;
  title: string;
  price: number;
  currency: string; // "ARS"
  category_id: string;
  status: ProductStatus;
  thumbnail_url: string;
  href: string;
  weight?: number;
  height?: number;
  width?: number;
  depth?: number;
}

// Uso esos ultimos 4 para enviar a shipping, los recupero con batch product

/** Respuesta paginada del endpoint GET /api/seller/productos. */
// Estos se mostraran en el listado de productos
export interface ProductListResponse {
  items: ProductListItem[];
  page: number;
  page_size: number;
  total: number;
  sort_by?: string;
  order?: string;
}

// ── Detalle completo: GET /api/seller/productos/:product_id ───────────────────
/** Producto con todos sus campos (respuesta del endpoint de detalle). */
// Se muestra cuando entra a la pagina de detalle del producto
export interface ProductDetail extends ProductListItem {
  description: string;
  weight: number; // kg
  height: number; // m
  width: number; // m
  depth: number; // m
  stock: number;
  images: string[]; // URLs
  created_at: string; // ISO 8601
}

// ── Categoría: GET /api/seller/categorias ────────────────────────────────────
export interface Category {
  category_id: string; // 'cat_living', etc.
  name: string; // 'Living', etc.
  icon?: string; // 'sofa', etc. (UI)
}

// ── Producto Unificado (Mock & UI) ───────────────────────────────────────────
/**
 * Representación del producto usada en el frontend.
 * Combina datos de la API (snake_case) con campos específicos de la UI (UniHousing).
 */
export interface Product extends ProductListItem {
  oldPrice?: number;
  seller: string;
  glyph: string;
  palette: string[];
  stock: number;
  location: string;
  shipping: number;
  width: number;
  height: number;
  depth: number;
  description?: string;
  images?: string[];
}

// ── Batch: POST /api/seller/productos/batch ───────────────────────────────────
/** Respuesta del endpoint POST /api/seller/productos/batch. */
export interface BatchProductResponse {
  products: ProductDetail[];
}

// ── Tienda: GET /api/seller/shops/:seller_id ──────────────────────────────────
export interface Shop {
  seller_id: string;
  store_name: string;
  city: string;
  total_products: number;
  categories: Category[];
  products: ProductListResponse;
}

// ── Opciones de ordenamiento ──────────────────────────────────────────────────
export type SortByOption = "price" | "created_at" | "title";
export type OrderOption = "asc" | "desc";

// ── Query params para el listado de productos ─────────────────────────────────
export interface ProductFilters {
  q?: string;
  /** Una única categoría (compatibilidad con API real). */
  category_id?: string;
  /** Múltiples categorías seleccionadas desde el drawer. */
  category_ids?: string[];
  sort_by?: SortByOption;
  order?: OrderOption;
  min_price?: number;
  max_price?: number;
  status?: ProductStatus;
  seller_id?: string;
  page?: number;
  page_size?: number;
}
