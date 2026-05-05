/**
 * Servicio de comunicación con la Seller App.
 *
 * Por ahora utiliza datos simulados (mock).  Cuando la Seller App esté
 * disponible, sólo hay que cambiar USE_MOCK a false y definir SELLER_BASE_URL
 * como variable de entorno.
 *
 * @see docs/03-apis.md — Seller App endpoints
 */

import type {
  ProductListItem,
  ProductListResponse,
  ProductFilters,
  Category,
  ProductDetail,
  SortByOption,
  OrderOption,
  Shop,
} from "@/app/lib/types/product";

// ── Configuración ─────────────────────────────────────────────────────────────
const USE_MOCK = true; // ← cambiar a false cuando la Seller App esté up
const SELLER_BASE_URL =
  process.env.SELLER_API_URL ?? "http://localhost:3001/api/seller";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
  { category_id: "cat_inmobiliaria", name: "Inmobiliaria" },
  { category_id: "cat_muebles", name: "Muebles" },
  { category_id: "cat_electrodomesticos", name: "Electrodomésticos" },
  { category_id: "cat_estudio", name: "Material de Estudio" },
  { category_id: "cat_otros", name: "Otros" },
];

const MOCK_PRODUCTS: ProductListItem[] = [
  {
    product_id: "prd_01HABCDEF001",
    seller_id: "usr_01HSELLER01",
    title: "Escritorio de madera con cajones",
    price: 42000,
    currency: "ARS",
    category_id: "cat_muebles",
    status: "new",
    thumbnail_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF001",
  },
  {
    product_id: "prd_01HABCDEF002",
    seller_id: "usr_01HSELLER02",
    title: "Silla ergonómica para estudio",
    price: 28500,
    currency: "ARS",
    category_id: "cat_muebles",
    status: "used",
    thumbnail_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF002",
  },
  {
    product_id: "prd_01HABCDEF003",
    seller_id: "usr_01HSELLER01",
    title: "Microondas 20L Samsung",
    price: 65000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    status: "new",
    thumbnail_url:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF003",
  },
  {
    product_id: "prd_01HABCDEF004",
    seller_id: "usr_01HSELLER03",
    title: "Biblioteca de madera 5 estantes",
    price: 55000,
    currency: "ARS",
    category_id: "cat_muebles",
    status: "used",
    thumbnail_url:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF004",
  },
  {
    product_id: "prd_01HABCDEF005",
    seller_id: "usr_01HSELLER02",
    title: "Pack de apuntes Ingeniería Civil 2do año",
    price: 8500,
    currency: "ARS",
    category_id: "cat_estudio",
    status: "new",
    thumbnail_url: "",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF005",
  },
  {
    product_id: "prd_01HABCDEF006",
    seller_id: "usr_01HSELLER04",
    title: "Lámpara de escritorio LED regulable",
    price: 15000,
    currency: "ARS",
    category_id: "cat_otros",
    status: "new",
    thumbnail_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF006",
  },
  {
    product_id: "prd_01HABCDEF007",
    seller_id: "usr_01HSELLER03",
    title: "Cafetera Nespresso Essenza",
    price: 89000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    status: "used",
    thumbnail_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF007",
  },
  {
    product_id: "prd_01HABCDEF008",
    seller_id: "usr_01HSELLER05",
    title: "Colchón individual 1 plaza firme",
    price: 120000,
    currency: "ARS",
    category_id: "cat_inmobiliaria",
    status: "new",
    thumbnail_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    href: "https://unihousing.com/api/seller/productos/prd_01HABCDEF008",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Simula latencia de red para que el skeleton sea visible. */
const simulateLatency = () =>
  new Promise((resolve) => setTimeout(resolve, 1200));

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * GET /api/seller/productos
 * Devuelve el listado paginado de productos con filtros opcionales.
 */
export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductListResponse> {
  // SI MOCK ES TRUE (por ahora lo dejamos en true) se usan los datos mockeados
  if (USE_MOCK) {
    await simulateLatency();

    let items = [...MOCK_PRODUCTS];

    // Filtro por texto
    if (filters.q) {
      const q = filters.q.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Filtro por categorías (soporta category_ids[] o category_id singular)
    const categoryIds = filters.category_ids?.length
      ? filters.category_ids
      : filters.category_id
        ? [filters.category_id]
        : [];
    if (categoryIds.length > 0) {
      items = items.filter((p) => categoryIds.includes(p.category_id));
    }

    // Filtro por precio
    if (filters.min_price !== undefined) {
      items = items.filter((p) => p.price >= filters.min_price!);
    }
    if (filters.max_price !== undefined) {
      items = items.filter((p) => p.price <= filters.max_price!);
    }

    // Filtro por seller
    if (filters.seller_id) {
      items = items.filter((p) => p.seller_id === filters.seller_id);
    }

    // Filtro por estado (usado como condición: nuevo/usado)
    if (filters.status) {
      items = items.filter((p) => p.status === filters.status);
    }

    // Ordenamiento
    if (filters.sort_by) {
      const field = filters.sort_by;
      const isDesc = filters.order === "desc";

      items = [...items].sort((a, b) => {
        let cmp = 0;
        if (field === "price") cmp = a.price - b.price;
        else if (field === "title") cmp = a.title.localeCompare(b.title);
        // created_at no está en el mock, así que no ordenamos
        return isDesc ? -cmp : cmp;
      });
    }

    // Paginación
    const page = filters.page ?? 1;
    const page_size = filters.page_size ?? 20;
    const start = (page - 1) * page_size;
    const paginatedItems = items.slice(start, start + page_size);

    return {
      items: paginatedItems,
      page,
      page_size,
      total: items.length,
      sort_by: filters.sort_by || "created_at",
      order: filters.order || "desc",
    };
  }

  // SI MOCK ES FALSE ENTONCES SI SE COMUNICARA CON LA SELLER APP
  // ── API real ──────────────────────────────────────────────────────────────
  // Arma la query correctamente respecto a la seller api con los filtros recibidos
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  // Solo hay una categoria seleccionada por ahora, no hace falta usar category_ids
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

  // Cuando cambie la URL, por ejemplo por haber buscado algo,
  // nextjs automaticamente actualiza el cache de esta peticion
  // y vuelve a ejecutar la funcion
  const res = await fetch(`${SELLER_BASE_URL}/productos?${params.toString()}`, {
    next: { revalidate: 60 }, // ISR: revalidar cada 60 s
  });

  // interface variable = JSON.parse(res)

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
  // SI MOCK ES TRUE (por ahora lo dejamos en true) se usan los datos mockeados
  if (USE_MOCK) {
    await simulateLatency();
    const base = MOCK_PRODUCTS.find((p) => p.product_id === product_id);
    if (!base) return null;
    return {
      ...base,
      description: "Descripción detallada del producto. Excelente estado.",
      weight: 10,
      height: 0.8,
      width: 1.2,
      depth: 0.6,
      stock: 3,
      images: [base.thumbnail_url],
      created_at: new Date().toISOString(),
    };
  }

  // SI MOCK ES FALSE ENTONCES SI SE COMUNICARA CON LA SELLER APP
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
  // SI MOCK ES TRUE (por ahora lo dejamos en true) se usan los datos mockeados
  if (USE_MOCK) {
    await simulateLatency();
    return MOCK_CATEGORIES;
  }

  // SI MOCK ES FALSE ENTONCES SI SE COMUNICARA CON LA SELLER APP
  const res = await fetch(`${SELLER_BASE_URL}/categorias`, {
    next: { revalidate: 43200 }, // categorías cambian poco, por lo tanto lo cacheamos por 12 horas
  });
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json(); // CONFIO EN EL CONTRATO CON LA API
}

/**
 * GET /api/seller/shops/:seller_id
 * Devuelve la información pública de la tienda de un vendedor, incluyendo datos generales, categorías en las que publica y el listado paginado de sus productos activos.
 */
export async function getShopById(
  seller_id: string,
  page = 1,
  page_size = 20,
): Promise<Shop | null> {
  // SI MOCK ES TRUE (por ahora lo dejamos en true) se usan los datos mockeados
  if (USE_MOCK) {
    await simulateLatency();
    const items = MOCK_PRODUCTS.filter((p) => p.seller_id === seller_id);
    if (items.length === 0) return null; // 404

    // Obtener las categorías de los productos de este vendedor
    const categoryIds = Array.from(new Set(items.map((p) => p.category_id)));
    const categories = MOCK_CATEGORIES.filter((c) =>
      categoryIds.includes(c.category_id),
    );

    const start = (page - 1) * page_size;
    const paginatedItems = items.slice(start, start + page_size);

    return {
      seller_id,
      store_name: `Muebles del Sur`, // Nombre de ejemplo
      city: "Bahía Blanca",
      total_products: items.length,
      categories,
      products: {
        items: paginatedItems,
        page,
        page_size,
        total: items.length,
        sort_by: "created_at",
        order: "desc",
      },
    };
  }

  // SI MOCK ES FALSE ENTONCES SI SE COMUNICARA CON LA SELLER APP
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

  if (USE_MOCK) {
    await simulateLatency();
    const byId = new Map(
      MOCK_PRODUCTS.map((product) => [product.product_id, product]),
    );
    return uniqueIds
      .map((productId) => byId.get(productId))
      .filter((product): product is ProductListItem => Boolean(product));
  }

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
