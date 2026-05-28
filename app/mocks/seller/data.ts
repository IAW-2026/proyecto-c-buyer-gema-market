/**
 * Datos mock compartidos por todos los route handlers de /api/seller/*.
 * Cuando la Seller App real esté disponible, estos archivos simplemente se eliminan.
 */

export const MOCK_SELLERS: Record<
  string,
  { shop_name: string; logo_url: string; bio?: string; city: string }
> = {
  usr_01HSELLER01: {
    shop_name: "MaderPlac",
    logo_url:
      "https://api.dicebear.com/9.x/initials/png?seed=MaderPlac&backgroundColor=b6e3f4&size=64",
    bio: "Muebles de madera maciza hechos a mano. Más de 10 años equipando hogares y departamentos en Bahía Blanca.",
    city: "Bahía Blanca",
  },
  usr_01HSELLER02: {
    shop_name: "Ergonómica BA",
    logo_url:
      "https://api.dicebear.com/9.x/initials/png?seed=Ergon%C3%B3mica+BA&backgroundColor=c0aede&size=64",
    bio: "Mobiliario y accesorios ergonómicos para el trabajo y el estudio. Envíos a todo Bahía Blanca.",
    city: "Bahía Blanca",
  },
  usr_01HSELLER03: {
    shop_name: "Café & Más",
    logo_url:
      "https://api.dicebear.com/9.x/initials/png?seed=Caf%C3%A9+%26+M%C3%A1s&backgroundColor=ffd5dc&size=64",
    bio: "Todo para tu cocina y living. Electrodomésticos, sillas y mesas para armar el hogar perfecto.",
    city: "Bahía Blanca",
  },
  usr_01HSELLER04: {
    shop_name: "TechStudy",
    logo_url:
      "https://api.dicebear.com/9.x/initials/png?seed=TechStudy&backgroundColor=d1f4cc&size=64",
    bio: "Equipamos espacios de estudio y trabajo en casa. Lámparas, sillas, escritorios y storage.",
    city: "Bahía Blanca",
  },
  usr_01HSELLER05: {
    shop_name: "UniHousing",
    logo_url:
      "https://api.dicebear.com/9.x/initials/png?seed=UniHousing&backgroundColor=ffdfbf&size=64",
    bio: "Productos seleccionados para departamentos de estudiantes. Coordinamos el envío con UniHousing.",
    city: "Bahía Blanca",
  },
};

export const MOCK_CATEGORIES = [
  { category_id: "cat_inmobiliaria", name: "Inmobiliaria" },
  { category_id: "cat_muebles", name: "Muebles" },
  { category_id: "cat_electrodomesticos", name: "Electrodomésticos" },
  { category_id: "cat_estudio", name: "Material de Estudio" },
  { category_id: "cat_otros", name: "Otros" },
];

export const MOCK_PRODUCTS = [
  {
    // Escritorio de madera — foto: desk with chair and drawer (ergonofis)
    product_id: "prd_01HABCDEF001",
    seller_id: "usr_01HSELLER01",
    title: "Escritorio de madera con cajones",
    description:
      "Escritorio de madera sólida con tres cajones. Ideal para estudiantes. Excelente estado.",
    price: 42000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 18,
    height: 0.75,
    width: 1.2,
    depth: 0.6,
    stock: 2,
    thumbnail_url:
      "https://images.unsplash.com/photo-1772761482020-3cea792b5de7?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1772761482020-3cea792b5de7?w=800&q=80",
    ],
    material: "Madera maciza",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF001",
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    // Silla ergonómica — foto: gray ergonomic chair beside table (EFFYDESK)
    product_id: "prd_01HABCDEF002",
    seller_id: "usr_01HSELLER02",
    title: "Silla ergonómica para estudio",
    description:
      "Silla ergonómica con soporte lumbar ajustable. Muy cómoda para largas jornadas de estudio.",
    price: 28500,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "usado",
    weight: 10,
    height: 1.1,
    width: 0.65,
    depth: 0.65,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?w=800&q=80",
      "https://images.unsplash.com/photo-1761123261084-53c40fe1e607?w=800&q=80",
    ],
    material: "Nylon y acero",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF002",
    created_at: "2026-04-12T09:00:00Z",
  },
  {
    // Microondas — foto: white microwave oven on wooden kitchen cabinet
    product_id: "prd_01HABCDEF003",
    seller_id: "usr_01HSELLER01",
    title: "Microondas 20L Samsung",
    description:
      "Microondas Samsung de 20 litros y 700W. Excelente estado, con manual y caja original.",
    price: 65000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    condition: "nuevo",
    weight: 11,
    height: 0.25,
    width: 0.44,
    depth: 0.34,
    stock: 3,
    thumbnail_url:
      "https://images.unsplash.com/photo-1608384156808-418b5c079968?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1608384156808-418b5c079968?w=800&q=80",
      "https://images.unsplash.com/photo-1630699144310-980c8ed310e3?w=800&q=80",
    ],
    material: "Acero y plástico",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF003",
    created_at: "2026-04-14T11:00:00Z",
  },
  {
    // Biblioteca — foto: books fill a wooden bookshelf
    product_id: "prd_01HABCDEF004",
    seller_id: "usr_01HSELLER03",
    title: "Biblioteca de madera 5 estantes",
    description:
      "Biblioteca de madera con 5 estantes amplios. Perfecta para organizar libros y materiales de estudio.",
    price: 55000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "usado",
    weight: 22,
    height: 1.8,
    width: 0.9,
    depth: 0.3,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1741851374666-1bc849a293c3?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1741851374666-1bc849a293c3?w=800&q=80",
      "https://images.unsplash.com/photo-1542713504-03db5fb21c66?w=800&q=80",
    ],
    material: "Madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF004",
    created_at: "2026-04-16T08:30:00Z",
  },
  {
    // Sillón individual — foto: beige fabric armchair in modern living room
    product_id: "prd_01HABCDEF005",
    seller_id: "usr_01HSELLER02",
    title: "Sillón Individual de Tela",
    description:
      "Sillón individual tapizado en tela resistente, muy cómodo y fácil de limpiar. Patas de madera. Ideal para living o dormitorio.",
    price: 68000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 15,
    height: 0.9,
    width: 0.8,
    depth: 0.85,
    stock: 3,
    thumbnail_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    material: "Tela y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF005",
    created_at: "2026-04-18T14:00:00Z",
  },
  {
    // Lámpara LED — foto: black and silver desk lamp on wooden table
    product_id: "prd_01HABCDEF006",
    seller_id: "usr_01HSELLER04",
    title: "Lámpara de escritorio LED regulable",
    description:
      "Lámpara LED de escritorio con intensidad y temperatura de color regulable. USB-C incluido.",
    price: 15000,
    currency: "ARS",
    category_id: "cat_otros",
    condition: "nuevo",
    weight: 0.8,
    height: 0.45,
    width: 0.12,
    depth: 0.12,
    stock: 4,
    thumbnail_url:
      "https://images.unsplash.com/photo-1587201598460-ef022518a7e7?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1587201598460-ef022518a7e7?w=800&q=80",
    ],
    material: "Aluminio y plástico ABS",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF006",
    created_at: "2026-04-20T16:00:00Z",
  },
  {
    // Cafetera Nespresso — foto: silver Nespresso machine (JJ Rocha)
    product_id: "prd_01HABCDEF007",
    seller_id: "usr_01HSELLER03",
    title: "Cafetera Nespresso Essenza",
    description:
      "Cafetera Nespresso Essenza Mini en perfecto estado. Incluye 10 cápsulas de cortesía.",
    price: 89000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    condition: "usado",
    weight: 2.1,
    height: 0.32,
    width: 0.16,
    depth: 0.23,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1574728015355-8b350afff15f?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1574728015355-8b350afff15f?w=800&q=80",
    ],
    material: "Plástico ABS",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF007",
    created_at: "2026-04-22T10:00:00Z",
  },
  {
    product_id: "prd_01HABCDEF008",
    seller_id: "usr_01HSELLER05",
    title: "Colchón dos plazas",
    description:
      "Colchón de 2 plazas, espuma de alta densidad. Ideal para alquiler de habitación. Poco uso.",
    price: 120000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
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
    material: "Espuma de alta densidad",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF008",
    created_at: "2026-04-25T09:00:00Z",
  },
  {
    // Frigobar — foto: refrigerator filled with food and drinks
    product_id: "prd_01HABCDEF009",
    seller_id: "usr_01HSELLER01",
    title: "Frigobar Whirlpool 120L",
    description:
      "Frigobar ideal para habitaciones de estudiantes. Bajo consumo, silencioso y en perfecto estado.",
    price: 185000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    condition: "usado",
    weight: 25,
    height: 0.85,
    width: 0.5,
    depth: 0.5,
    stock: 1,
    thumbnail_url:
      "https://images.unsplash.com/photo-1643494847705-74808059bf07?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1643494847705-74808059bf07?w=800&q=80",
    ],
    material: "Acero y plástico",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF009",
    created_at: "2026-04-26T12:00:00Z",
  },
  {
    // Sofá 3 cuerpos — foto: modern gray 3-seat sofa in living room
    product_id: "prd_01HABCDEF010",
    seller_id: "usr_01HSELLER04",
    title: "Sofá 3 Cuerpos de Tela Gris",
    description:
      "Sofá de 3 cuerpos tapizado en tela microfibra gris. Estructura de madera reforzada, relleno de espuma de alta densidad. Ideal para living.",
    price: 185000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 45,
    height: 0.88,
    width: 2.1,
    depth: 0.9,
    stock: 2,
    thumbnail_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    ],
    material: "Tela microfibra y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF010",
    created_at: "2026-04-27T10:30:00Z",
  },
  {
    // Estantería metálica — foto: industrial shelving units with items (Adrien Olichon)
    product_id: "prd_01HABCDEF011",
    seller_id: "usr_01HSELLER02",
    title: "Estantería Metálica Reforzada",
    description:
      "Estantería de metal con 4 niveles, soporta hasta 50kg por estante. Ideal para depósitos o garage.",
    price: 32000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 12,
    height: 1.5,
    width: 0.7,
    depth: 0.3,
    stock: 4,
    thumbnail_url:
      "https://images.unsplash.com/photo-1770910195585-825a1181a704?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1770910195585-825a1181a704?w=800&q=80",
    ],
    material: "Acero",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF011",
    created_at: "2026-04-28T09:15:00Z",
  },
  {
    // Mesa de comedor — foto: round wooden dining table with 4 chairs
    product_id: "prd_01HABCDEF012",
    seller_id: "usr_01HSELLER03",
    title: "Mesa de Comedor ",
    description:
      "Mesa de comedor de madera. Capacidad para 6 personas. Diseño moderno y minimalista.",
    price: 95000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 20,
    height: 0.75,
    width: 1.0,
    depth: 1.0,
    stock: 3,
    thumbnail_url:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    ],
    material: "MDF y acero",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF012",
    created_at: "2026-04-29T15:45:00Z",
  },
  {
    // Ventilador — foto: white stand fan turned on in room (Delaney Van)
    product_id: "prd_01HABCDEF013",
    seller_id: "usr_01HSELLER05",
    title: 'Ventilador de Pie Liliana 18"',
    description:
      "Ventilador de pie con 3 velocidades, oscilante y altura regulable. Muy potente.",
    price: 48000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    condition: "usado",
    weight: 5.5,
    height: 1.6,
    width: 0.45,
    depth: 0.45,
    stock: 2,
    thumbnail_url:
      "https://images.unsplash.com/photo-1601084195907-44baaa49dabd?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1601084195907-44baaa49dabd?w=800&q=80",
    ],
    material: "Plástico y acero",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF013",
    created_at: "2026-04-30T11:20:00Z",
  },
  {
    // Mesa de luz — foto: brown wooden 2-drawer nightstand (Megan Bucknall)
    product_id: "prd_01HABCDEF014",
    seller_id: "usr_01HSELLER01",
    title: "Mesa de Luz Minimalista",
    description:
      "Mesa de luz con un cajón y estante inferior. Madera laqueada blanca, diseño moderno.",
    price: 18000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 7,
    height: 0.6,
    width: 0.4,
    depth: 0.35,
    stock: 6,
    thumbnail_url:
      "https://images.unsplash.com/photo-1593194632872-3d19dab6e278?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1593194632872-3d19dab6e278?w=800&q=80",
    ],
    material: "Madera laqueada",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF014",
    created_at: "2026-05-01T08:00:00Z",
  },
  {
    // Ropero 3 puertas — foto: white wooden wardrobe
    product_id: "prd_01HABCDEF015",
    seller_id: "usr_01HSELLER04",
    title: "Ropero 3 Puertas",
    description:
      "Ropero de 3 puertas. Interior con colgador, estantes y cajones. Madera laqueada blanca.",
    price: 148000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 55,
    height: 1.9,
    width: 1.5,
    depth: 0.55,
    stock: 2,
    thumbnail_url:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80",
    ],
    material: "Madera laqueada y espejo",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF015",
    created_at: "2026-05-02T14:30:00Z",
  },
  {
    // Pava eléctrica — foto: black electric kettle (engin akyurt)
    product_id: "prd_01HABCDEF016",
    seller_id: "usr_01HSELLER02",
    title: "Pava Eléctrica Philips 1.7L",
    description:
      "Pava eléctrica con corte automático para mate. Acero inoxidable de alta calidad.",
    price: 52000,
    currency: "ARS",
    category_id: "cat_electrodomesticos",
    condition: "nuevo",
    weight: 1.5,
    height: 0.25,
    width: 0.2,
    depth: 0.2,
    stock: 8,
    thumbnail_url:
      "https://images.unsplash.com/photo-1643114786355-ff9e52736eab?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1643114786355-ff9e52736eab?w=800&q=80",
    ],
    material: "Acero inoxidable",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF016",
    created_at: "2026-05-03T09:45:00Z",
  },
  {
    // Cama matrimonial — foto: cama doble con respaldo tapizado y ropa blanca
    product_id: "prd_01HABCDEF017",
    seller_id: "usr_01HSELLER05",
    title: "Cama Matrimonial con Respaldo Tapizado",
    description:
      "Cama matrimonial 2 plazas con respaldo tapizado en tela gris. Estructura de madera reforzada. Sin colchón.",
    price: 138000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 35,
    height: 1.1,
    width: 1.6,
    depth: 2.0,
    stock: 3,
    thumbnail_url:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    ],
    material: "Madera y tela",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF017",
    created_at: "2026-05-04T10:00:00Z",
  },
  {
    // Sofá loveseat — foto: sofá de 2 cuerpos tapizado en tela clara
    product_id: "prd_01HABCDEF018",
    seller_id: "usr_01HSELLER01",
    title: "Sofá de 2 Cuerpos Gris",
    description:
      "Sofá de 2 cuerpos tapizado en tela gris. Estructura de madera reforzada, patas metálicas. Muy cómodo.",
    price: 135000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 32,
    height: 0.85,
    width: 1.6,
    depth: 0.88,
    stock: 3,
    thumbnail_url:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    ],
    material: "Tela y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF018",
    created_at: "2026-05-05T09:00:00Z",
  },
  {
    // Silla de bar — foto: taburete de bar alto de madera
    product_id: "prd_01HABCDEF019",
    seller_id: "usr_01HSELLER03",
    title: "Taburete de Bar de Madera",
    description:
      "Taburete alto de madera maciza para cocina o bar. Asiento redondo, sin respaldo. Muy estable.",
    price: 14000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 4,
    height: 0.75,
    width: 0.38,
    depth: 0.38,
    stock: 6,
    thumbnail_url:
      "https://images.unsplash.com/photo-1554295405-abb8fd54f153?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1554295405-abb8fd54f153?w=800&q=80",
    ],
    material: "Madera maciza",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF019",
    created_at: "2026-05-06T11:30:00Z",
  },
  {
    // Silla escandinava — foto: silla de madera estilo nórdico
    product_id: "prd_01HABCDEF020",
    seller_id: "usr_01HSELLER04",
    title: "Silla Escandinava de Madera",
    description:
      "Silla de madera maciza estilo escandinavo. Asiento tapizado en tela beis. Cómoda y resistente.",
    price: 22000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 4.5,
    height: 0.85,
    width: 0.5,
    depth: 0.52,
    stock: 8,
    thumbnail_url:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    ],
    material: "Madera y tela",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF020",
    created_at: "2026-05-07T08:45:00Z",
  },

  {
    // Banco tapizado — foto: banco tapizado
    product_id: "prd_01HABCDEF021",
    seller_id: "usr_01HSELLER05",
    title: "Banco Tapizado",
    description:
      "Banco tapizado en tela con patas de madera. Ideal para el pie de la cama o entrada.",
    price: 27000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 6,
    height: 0.45,
    width: 1.0,
    depth: 0.35,
    stock: 6,
    thumbnail_url:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80",
    ],
    material: "Tela y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF021",
    created_at: "2026-05-09T10:15:00Z",
  },
  {
    // Espejo de pie — foto: espejo redondo de cuerpo entero apoyado en pared
    product_id: "prd_01HABCDEF022",
    seller_id: "usr_01HSELLER01",
    title: "Espejo de Pie Redondo",
    description:
      "Espejo de cuerpo entero con marco de madera. Puede apoyarse en la pared o colgarse. 160 x 50 cm.",
    price: 31000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 9,
    height: 1.6,
    width: 0.5,
    depth: 0.04,
    stock: 7,
    thumbnail_url:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    ],
    material: "Vidrio y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF022",
    created_at: "2026-05-10T09:30:00Z",
  },
  {
    // Sillón de terciopelo — foto: sillón tapizado en terciopelo blanco
    product_id: "prd_01HABCDEF023",
    seller_id: "usr_01HSELLER03",
    title: "Sillón de Terciopelo blanco",
    description:
      "Sillón individual tapizado en terciopelo color blanco. Patas de madera torneadas. Ideal para dormitorio o living.",
    price: 74000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 14,
    height: 0.88,
    width: 0.77,
    depth: 0.82,
    stock: 4,
    thumbnail_url:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    ],
    material: "Terciopelo y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF023",
    created_at: "2026-05-11T13:00:00Z",
  },
  {
    // Cama de 2 plaza — foto: cama individual con ropa blanca en habitación
    product_id: "prd_01HABCDEF024",
    seller_id: "usr_01HSELLER04",
    title: "Cama de 2 Plazas con Cabecero Tapizado",
    description:
      "Cama de una plaza con cabecero tapizado. Estructura de madera maciza. Sin colchón incluido.",
    price: 72000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 18,
    height: 0.95,
    width: 1.0,
    depth: 1.9,
    stock: 5,
    thumbnail_url:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80",
    ],
    material: "Madera y tela",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF024",
    created_at: "2026-05-12T10:00:00Z",
  },

  {
    // Silla de comedor — foto: sillas de comedor tapizadas en tela clara
    product_id: "prd_01HABCDEF025",
    seller_id: "usr_01HSELLER05",
    title: "Silla de Comedor Tapizada",
    description:
      "Silla de comedor con asiento y respaldo tapizado en tela color crema. Patas de madera. Venta por unidad.",
    price: 18500,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 5,
    height: 0.88,
    width: 0.46,
    depth: 0.52,
    stock: 12,
    thumbnail_url:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
    ],
    material: "Tela y madera",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF025",
    created_at: "2026-05-15T08:30:00Z",
  },
  {
    // Perchero de pie — foto: perchero de madera estilo nórdico
    product_id: "prd_01HABCDEF026",
    seller_id: "usr_01HSELLER04",
    title: "Perchero de Pie Estilo Nórdico",
    description:
      "Perchero de pie de madera con 8 ganchos. Diseño minimalista escandinavo. Fácil de armar.",
    price: 17000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 4,
    height: 1.7,
    width: 0.4,
    depth: 0.4,
    stock: 5,
    thumbnail_url:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    ],
    material: "Madera de haya",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF026",
    created_at: "2026-05-16T14:20:00Z",
  },
  {
    // Escritorio minimalista — foto: escritorio blanco moderno con superficie amplia
    product_id: "prd_01HABCDEF027",
    seller_id: "usr_01HSELLER03",
    title: "Escritorio Minimalista Blanco",
    description:
      "Escritorio de superficie amplia laqueado blanco. Sin cajones, diseño minimalista. Ideal para home office.",
    price: 54000,
    currency: "ARS",
    category_id: "cat_muebles",
    condition: "nuevo",
    weight: 16,
    height: 0.75,
    width: 1.2,
    depth: 0.6,
    stock: 4,
    thumbnail_url:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    ],
    material: "MDF laqueado",
    href: "http://localhost:3000/api/seller/productos/prd_01HABCDEF027",
    created_at: "2026-05-17T09:00:00Z",
  },
];
