/**
 * Datos mock compartidos por todos los route handlers de /api/seller/*.
 * Cuando la Seller App real esté disponible, estos archivos simplemente se eliminan.
 */

export const MOCK_CATEGORIES = [
  { category_id: "cat_inmobiliaria", name: "Inmobiliaria" },
  { category_id: "cat_muebles", name: "Muebles" },
  { category_id: "cat_electrodomesticos", name: "Electrodomésticos" },
  { category_id: "cat_estudio", name: "Material de Estudio" },
  { category_id: "cat_otros", name: "Otros" },
];

export const MOCK_PRODUCTS = [
  {
    product_id: "prd_01HABCDEF001",
    seller_id: "usr_01HSELLER01",
    title: "Escritorio de madera con cajones",
    description:
      "Escritorio de madera sólida con tres cajones. Ideal para estudiantes. Excelente estado.",
    price: 42000,
    currency: "ARS",
    category_id: "cat_muebles",
    status: "new",
    weight: 18,
    height: 0.75,
    width: 1.2,
    depth: 0.6,
    stock: 2,
    thumbnail_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF001",
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF002",
    seller_id: "usr_01HSELLER02",
    title: "Silla ergonómica para estudio",
    description:
      "Silla ergonómica con soporte lumbar ajustable. Muy cómoda para largas jornadas de estudio.",
    price: 28500,
    currency: "ARS",
    category_id: "cat_muebles",
    status: "used",
    weight: 10,
    height: 1.1,
    width: 0.65,
    depth: 0.65,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF002",
    created_at: "2026-04-12T09:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF003",
    seller_id: "usr_01HSELLER01",
    title: "Microondas 20L Samsung",
    description:
      "Microondas Samsung de 20 litros y 700W. Excelente estado, con manual y caja original.",
    price: 65000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    status: "new",
    weight: 11,
    height: 0.25,
    width: 0.44,
    depth: 0.34,
    stock: 3,
    thumbnail_url:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF003",
    created_at: "2026-04-14T11:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF004",
    seller_id: "usr_01HSELLER03",
    title: "Biblioteca de madera 5 estantes",
    description:
      "Biblioteca de madera con 5 estantes amplios. Perfecta para organizar libros y materiales de estudio.",
    price: 55000,
    currency: "ARS",
    category_id: "cat_muebles",
    status: "used",
    weight: 22,
    height: 1.8,
    width: 0.9,
    depth: 0.3,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF004",
    created_at: "2026-04-16T08:30:00Z",
  },
  {
    product_id: "prd_01HABCDEF005",
    seller_id: "usr_01HSELLER02",
    title: "Pack de apuntes Ingeniería Civil 2do año",
    description:
      "Apuntes completos de Resistencia de Materiales, Álgebra Lineal y Termodinámica. Bien organizados y actualizados.",
    price: 8500,
    currency: "ARS",
    category_id: "cat_estudio",
    status: "new",
    weight: 1.2,
    height: 0.03,
    width: 0.21,
    depth: 0.3,
    stock: 5,
    thumbnail_url: "",
    images: [],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF005",
    created_at: "2026-04-18T14:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF006",
    seller_id: "usr_01HSELLER04",
    title: "Lámpara de escritorio LED regulable",
    description:
      "Lámpara LED de escritorio con intensidad y temperatura de color regulable. USB-C incluido.",
    price: 15000,
    currency: "ARS",
    category_id: "cat_otros",
    status: "new",
    weight: 0.8,
    height: 0.45,
    width: 0.12,
    depth: 0.12,
    stock: 4,
    thumbnail_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF006",
    created_at: "2026-04-20T16:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF007",
    seller_id: "usr_01HSELLER03",
    title: "Cafetera Nespresso Essenza",
    description:
      "Cafetera Nespresso Essenza Mini en perfecto estado. Incluye 10 cápsulas de cortesía.",
    price: 89000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    status: "used",
    weight: 2.1,
    height: 0.32,
    width: 0.16,
    depth: 0.23,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF007",
    created_at: "2026-04-22T10:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF008",
    seller_id: "usr_01HSELLER05",
    title: "Colchón individual 1 plaza firme",
    description:
      "Colchón de 1 plaza, espuma de alta densidad. Ideal para alquiler de habitación. Poco uso.",
    price: 120000,
    currency: "ARS",
    category_id: "cat_inmobiliaria",
    status: "new",
    weight: 14,
    height: 0.2,
    width: 0.8,
    depth: 1.9,
    stock: 2,
    thumbnail_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    ],
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF008",
    created_at: "2026-04-25T09:00:00Z",
  },
];
