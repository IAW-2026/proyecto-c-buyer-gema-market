# AGENTS.md — Buyer App Development Guide

> **Contexto**: UniHousing es un marketplace estudiantil para venta de muebles y artículos para el hogar en Bahía Blanca. Este documento define estándares, patrones y buenas prácticas para desarrollar la **Buyer App** con Next.js, React 19 y TypeScript.

---

## 1. Contexto del Proyecto

### Descripción del Sistema

- **Tipo**: Marketplace (Tipo C)
- **Propósito**: Conectar compradores (estudiantes) con vendedores para equipar departamentos
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL

### Responsabilidades de Buyer App

La Buyer App es responsable de:

- **Identidad del comprador**: caché sincronizado de usuario desde Clerk (`usuario` table)
- **Órdenes de compra**: creación, estado y tracking (`orden` table)
- **Carrito de compras**: gestión de items (`carrito`, `item_carrito` tables)
- **Favoritos**: guardado de productos preferidos (`favorito` table)
- **Integración inter-apps**:
  - Consultar catálogo y detalles de productos → Seller App
  - Solicitar cotizaciones de envío → Shipping App
  - Iniciar pagos → Payments App
  - Recibir notificaciones de estado → Payments App, Shipping App

### Usuarios de Buyer App

| Rol     | Autenticación                            | Acceso                                   |
| ------- | ---------------------------------------- | ---------------------------------------- |
| `buyer` | Clerk (JWT con claim `"buyer" in roles`) | Marketplace, carrito, órdenes, favoritos |
| `admin` | Clerk (JWT con claim `"admin" in roles`) | Endpoints `/api/buyer/admin/*`           |

---

## 2. Arquitectura y Estructura de Directorios

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx              # Página de login (delegada a Clerk)
│   └── layout.tsx
├── (main)/
│   ├── layout.tsx                # Layout compartido (TopBar, SideNav, BottomNav)
│   ├── page.tsx                  # Home / marketplace
│   ├── cart/
│   │   └── page.tsx              # Carrito de compras
│   ├── checkout/
│   │   └── page.tsx              # Flujo de checkout
│   ├── orders/
│   │   ├── page.tsx              # Historial de órdenes
│   │   └── [id]/
│   │       └── page.tsx          # Detalle de orden
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx          # Detalle de producto
│   ├── favorites/
│   │   └── page.tsx              # Productos guardados
│   ├── search/
│   │   └── page.tsx              # Búsqueda y filtros
│   ├── account/
│   │   └── page.tsx              # Perfil del comprador
│   └── profile/
│       └── page.tsx              # Gestión de datos de comprador
├── api/
│   ├── buyer/
│   │   ├── ordenes/
│   │   │   ├── route.ts          # GET (listar órdenes del usuario)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET (detalle de orden)
│   │   ├── carrito/
│   │   │   ├── route.ts          # GET, POST, PUT (gestionar carrito)
│   │   │   └── items/
│   │   │       └── route.ts      # POST, DELETE (items del carrito)
│   │   ├── favoritos/
│   │   │   ├── route.ts          # GET (listar favoritos del usuario)
│   │   │   └── [product_id]/
│   │   │       └── route.ts      # POST, DELETE (agregar/quitar favorito)
│   │   ├── pagos/
│   │   │   └── [payment_id]/
│   │   │       └── route.ts      # Webhooks de Payments App
│   │   ├── envios/
│   │   │   └── [order_id]/
│   │   │       └── route.ts      # Webhooks de Shipping App
│   │   └── admin/
│   │       ├── ordenes/
│   │       │   └── route.ts      # GET (admin - listar todas las órdenes)
│   │       └── stats/
│   │           └── route.ts      # GET (admin - métricas)
│   ├── mock/
│   │   ├── categorias/
│   │   │   └── route.ts          # Mock de categorías (desarrollo)
│   │   └── productos/
│   │       └── route.ts          # Mock de productos (desarrollo)
│   ├── payments/
│   │   └── ordenes-de-pago/
│   │       └── route.ts          # POST (crear orden de pago en Payments App)
│   └── shipping/
│       └── cotizaciones/
│           └── route.ts          # POST (solicitar cotización en Shipping App)
├── components/
│   ├── BottomNav.tsx             # Navegación móvil
│   ├── SideNav.tsx               # Navegación desktop (sidebar)
│   ├── TopBar.tsx                # Barra superior
│   ├── features/
│   │   ├── home/
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryListServer.tsx  # Server Component
│   │   │   ├── HeaderHomePage.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FiltersPanel.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   ├── utils/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── filterParser.ts
│   │   │   │   └── filterSerializer.ts
│   │   │   └── hooks/
│   │   │       ├── useApplyFilters.ts
│   │   │       └── useFilteredParams.ts
│   │   ├── cart/
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartItemList.tsx
│   │   │   └── CartActions.tsx
│   │   ├── checkout/
│   │   │   ├── ShippingQuoteSelector.tsx
│   │   │   ├── PaymentInitiator.tsx
│   │   │   └── CheckoutSummary.tsx
│   │   ├── orders/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── OrderDetailView.tsx
│   │   └── favorites/
│   │       ├── FavoritesGrid.tsx
│   │       └── FavoritesSkeleton.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGridSkeleton.tsx
│   │   ├── ProductDetailClient.tsx
│   │   └── CategoryFilter.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── Field.tsx
│       ├── Icon.tsx
│       ├── Input.tsx
│       ├── Logo.tsx
│       ├── Pill.tsx
│       ├── ProductGlyph.tsx
│       ├── SectionTitle.tsx
│       ├── Skeleton.tsx
│       ├── Tabs.tsx
│       ├── TopBar.tsx
│       └── index.ts               # Barrel exports
├── lib/
│   ├── data.ts                   # Funciones de lectura de datos
│   ├── prisma.ts                 # Instancia singleton de Prisma
│   ├── utils.ts                  # Utilidades genéricas
│   ├── api/
│   │   ├── seller.ts             # Llamadas a Seller App
│   │   ├── payments.ts           # Llamadas a Payments App
│   │   └── shipping.ts           # Llamadas a Shipping App
│   ├── db/
│   │   ├── usuario.ts            # Queries: usuario
│   │   ├── orden.ts              # Queries: orden
│   │   ├── carrito.ts            # Queries: carrito
│   │   ├── item_carrito.ts       # Queries: item_carrito
│   │   └── favorito.ts           # Queries: favorito
│   ├── services/
│   │   ├── order.ts              # Lógica de negocio: órdenes
│   │   ├── cart.ts               # Lógica de negocio: carrito
│   │   ├── payment.ts            # Lógica de negocio: pagos
│   │   ├── shipping.ts           # Lógica de negocio: envíos
│   │   └── product.ts            # Lógica de negocio: productos
│   └── types/
│       ├── orders.ts             # Tipos de orden
│       └── product.ts            # Tipos de producto
├── globals.css                   # Estilos globales
└── layout.tsx                    # Root layout
```

---

## 3. Patrones y Buenas Prácticas

### 3.1 Organización de Código por Capas

#### **Layer 1: API Routes** (`app/api/buyer/*`)

- Punto de entrada HTTP para el frontend
- Validan JWT, autorizan rol (`buyer` o `admin`)
- Delegan lógica a servicios
- Retornan siempre JSON con estructura uniforme

```typescript
// Ejemplo: app/api/buyer/carrito/route.ts
import { auth } from "@clerk/nextjs/server";
import { getCartByUserId } from "@/lib/db/carrito";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const carrito = await getCartByUserId(userId);
  return NextResponse.json({ data: carrito });
}
```

#### **Layer 2: Services** (`lib/services/*`)

- Lógica de negocio reutilizable
- Orquestación de múltiples queries/APIs
- Validación de reglas de negocio
- Manejo de errores

```typescript
// Ejemplo: lib/services/order.ts
export async function createOrder(
  buyerId: string,
  cartItems: CartItem[],
  quoteId: string,
) {
  // Validar stock en Seller App
  // Crear orden en BD
  // Iniciar pago en Payments App
  // Retornar orden creada
}
```

#### **Layer 3: Database** (`lib/db/*`)

- Queries directas a Prisma
- Sin lógica de negocio
- Tipadas con TypeScript
- Documentadas

```typescript
// Ejemplo: lib/db/orden.ts
export async function createOrden(data: CreateOrdenInput) {
  return prisma.orden.create({ data });
}
```

#### **Layer 4: External APIs** (`lib/api/*`)

- Llamadas a apps externas (Seller, Payments, Shipping)
- Manejo de timeouts y errores
- Retry logic si aplica
- Logging

```typescript
// Ejemplo: lib/api/seller.ts
export async function fetchProducts(filters: ProductFilters) {
  const response = await fetch(`${SELLER_API_URL}/api/seller/productos`, {
    method: "GET",
    headers: {
      /* auth headers */
    },
  });
  return response.json();
}
```

### 3.2 Convenciones de Naming

| Tipo                | Convención         | Ejemplo                                      |
| ------------------- | ------------------ | -------------------------------------------- |
| Archivos/carpetas   | `kebab-case`       | `product-detail.tsx`, `order-history/`       |
| Componentes         | `PascalCase`       | `ProductCard.tsx`, `OrderTimeline.tsx`       |
| Funciones/variables | `camelCase`        | `fetchProducts()`, `cartItems`               |
| Constantes          | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_CART_ITEMS`             |
| Bases de datos      | `snake_case`       | `product_id`, `shipping_price`, `created_at` |
| Campos JSON API     | `snake_case`       | Todos los payloads JSON usan snake_case      |

### 3.3 Autenticación y Autorización

**Siempre usar Clerk para identidad:**

```typescript
// lib/middleware.ts (si usas middleware)
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function authMiddleware() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  const roles = (sessionClaims?.roles as string[]) || [];
  return { userId, roles };
}
```

**En API routes:**

```typescript
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roles = (session.sessionClaims?.roles as string[]) || [];
  if (!roles.includes("buyer")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Lógica de endpoint
}
```

### 3.4 Componentes React

**Preferir Server Components cuando sea posible:**

```typescript
// Ejemplo: app/(main)/page.tsx (Server Component)
import { fetchCategories } from '@/lib/api/seller';
import CategoryList from '@/components/features/home/CategoryList';

export default async function HomePage() {
  const categories = await fetchCategories();
  return <CategoryList categories={categories} />;
}
```

**Client Components solo para interactividad:**

```typescript
// Ejemplo: components/features/home/FiltersPanel.tsx
'use client';

import { useState } from 'react';

export function FiltersPanel() {
  const [filters, setFilters] = useState({});
  return (/* UI interactiva */);
}
```

### 3.5 Data Fetching

**En Server Components: fetch directo o consultas a BD**

```typescript
export default async function Page() {
  // ✅ OK: fetch o Prisma en Server Component
  const products = await fetchProducts();
  return <ProductGrid products={products} />;
}
```

**En Client Components: usar React Query o hooks**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function CartSummary() {
  const { data: carrito } = useQuery({
    queryKey: ['carrito'],
    queryFn: async () => {
      const res = await fetch('/api/buyer/carrito');
      return res.json();
    },
  });

  return (/* UI del carrito */);
}
```

### 3.6 Manejo de Errores

**En API routes: siempre retornar JSON tipado**

```typescript
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await createOrder(body);
    return NextResponse.json<ApiResponse<typeof result>>({
      ok: true,
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json<ApiResponse<null>>(
      {
        ok: false,
        error: {
          code: "ORDER_CREATION_FAILED",
          message: err instanceof Error ? err.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
```

### 3.7 Tipado TypeScript Strict

**Siempre usar tipos explícitos:**

```typescript
// ✅ Bien
async function getOrderById(orderId: string): Promise<Orden | null> {
  return prisma.orden.findUnique({ where: { id: orderId } });
}

// ❌ Evitar
async function getOrderById(id) {
  return prisma.orden.findUnique({ where: { id } });
}
```

---

## 4. Inter-App Communication

### 4.1 Convenciones Globales

| Concepto                    | Convención                                   | Ejemplo                            |
| --------------------------- | -------------------------------------------- | ---------------------------------- |
| Identificador de orden      | `order_id` (generado por Buyer App)          | `ord_01HXYZ123ABC`                 |
| Identificador de pago       | `payment_id` (generado por Payments App)     | `pay_01HXYZ123ABC`                 |
| Identificador de cotización | `quote_id` (FK lógica → Shipping App)        | `quote_01HXYZ123ABC`               |
| Campos JSON                 | `snake_case` siempre                         | `user_id`, `product_id`, `paid_at` |
| Autenticación               | JWT de Clerk (claim `sub` = `clerk_user_id`) | Validado en cada app               |

### 4.2 Seller App Integration

**Fetch productos con filtros:**

```typescript
// lib/api/seller.ts
export async function fetchProducts(filters: ProductFilters) {
  const queryParams = new URLSearchParams({
    q: filters.search || "",
    category_id: filters.categoryId || "",
    min_price: String(filters.minPrice || 0),
    max_price: String(filters.maxPrice || 999999),
    page: String(filters.page || 1),
    page_size: String(filters.pageSize || 20),
    sort_by: filters.sortBy || "created_at",
    order: filters.order || "desc",
  });

  const res = await fetch(
    `${SELLER_API_URL}/api/seller/productos?${queryParams}`,
  );
  if (!res.ok) throw new Error(`Seller API error: ${res.status}`);
  return res.json();
}
```

### 4.3 Shipping App Integration

**Solicitar cotización:**

```typescript
// lib/services/shipping.ts
export async function requestQuote(params: QuoteParams) {
  const response = await fetch(
    `${SHIPPING_API_URL}/api/shipping/cotizaciones`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: params.productId,
        buyer_id: params.buyerId,
        seller_id: params.sellerId,
        quantity: params.quantity,
      }),
    },
  );

  if (!response.ok) throw new Error("Shipping quote request failed");
  return response.json();
}
```

### 4.4 Payments App Integration

**Crear orden de pago:**

```typescript
// lib/services/payment.ts
export async function initiatePayment(orderId: string, amount: number) {
  const response = await fetch(
    `${PAYMENTS_API_URL}/api/payments/ordenes-de-pago`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        buyer_id: getUserId(),
        seller_id: sellerIdFromOrder,
        amount,
        currency: "ARS",
      }),
    },
  );

  if (!response.ok) throw new Error("Payment initiation failed");
  return response.json();
}
```

### 4.5 Webhooks Recibidos

**Payments App notifica pago aprobado:**

```typescript
// app/api/buyer/pagos/[payment_id]/route.ts
export async function POST(
  req: Request,
  { params }: { params: { payment_id: string } },
) {
  const body = await req.json();

  // Procesar notificación
  for (const order of body.orders) {
    await updateOrderStatus(order.order_id, "paid");
    await notifyUser(order.order_id, "Tu pago fue aprobado");
  }

  return NextResponse.json({ ok: true });
}
```

**Shipping App notifica estado de envío:**

```typescript
// app/api/buyer/envios/[order_id]/route.ts
export async function POST(
  req: Request,
  { params }: { params: { order_id: string } },
) {
  const body = await req.json();

  await updateOrderShippingStatus(params.order_id, body.status);
  await notifyUser(params.order_id, `Tu envío está: ${body.status}`);

  return NextResponse.json({ ok: true });
}
```

---

## 5. Base de Datos (Prisma)

### 5.1 Estructura de Datos

**Usuario (cache de Clerk):**

```prisma
model usuario {
  id              String    @id @default(cuid())
  clerk_user_id   String    @unique
  email           String
  full_name       String
  address         Json?     // { street, city, postal_code, country }
  role            String    @default("buyer")
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  ordenes         Orden[]
  carrito         Carrito?
  favoritos       Favorito[]

  @@index([clerk_user_id])
  @@index([email])
}
```

**Orden:**

```prisma
model Orden {
  id              String    @id @default(cuid())
  buyer_id        String
  buyer           usuario   @relation(fields: [buyer_id], references: [id])
  seller_id       String    // FK lógica → Seller App
  product_id      String    // FK lógica → Seller App
  quantity        Int
  unit_price      Decimal   @db.Decimal(12, 2)
  quote_id        String?   // FK lógica → Shipping App
  shipping_price  Decimal   @db.Decimal(12, 2)
  total_amount    Decimal   @db.Decimal(12, 2)
  currency        String    @default("ARS")
  status          String    @default("created") // created, awaiting_payment, paid, shipping, delivered, cancelled, refunded, disputed
  payment_id      String?   // FK lógica → Payments App
  shipping_id     String?   // FK lógica → Shipping App
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  @@index([buyer_id])
  @@index([status])
  @@index([payment_id])
}
```

**Carrito:**

```prisma
model Carrito {
  id              String          @id @default(cuid())
  buyer_id        String          @unique
  buyer           usuario         @relation(fields: [buyer_id], references: [id])
  items           ItemCarrito[]
  created_at      DateTime        @default(now())
  updated_at      DateTime        @updatedAt
}

model ItemCarrito {
  id              String    @id @default(cuid())
  carrito_id      String
  carrito         Carrito   @relation(fields: [carrito_id], references: [id], onDelete: Cascade)
  product_id      String    // FK lógica → Seller App
  quantity        Int       @default(1)
  added_at        DateTime  @default(now())

  @@unique([carrito_id, product_id])
}
```

**Favorito:**

```prisma
model Favorito {
  buyer_id        String
  buyer           usuario   @relation(fields: [buyer_id], references: [id])
  product_id      String    // FK lógica → Seller App
  created_at      DateTime  @default(now())

  @@id([buyer_id, product_id])
}
```

### 5.2 Queries Ejemplos

```typescript
// lib/db/orden.ts
import { prisma } from "@/lib/prisma";

export async function createOrden(data: {
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}) {
  return prisma.orden.create({
    data: { ...data, currency: "ARS", status: "created" },
  });
}

export async function getOrdenById(orderId: string) {
  return prisma.orden.findUnique({
    where: { id: orderId },
    include: { buyer: true },
  });
}

export async function getOrdensByBuyerId(
  buyerId: string,
  page = 1,
  pageSize = 10,
) {
  return prisma.orden.findMany({
    where: { buyer_id: buyerId },
    orderBy: { created_at: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}
```

---

## 6. Estilos y Theming

### 6.1 Tailwind CSS

**Configuración:**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // blue
        secondary: "#10B981", // emerald
        danger: "#EF4444", // red
      },
      spacing: {
        safe: "max(1rem, env(safe-area-inset-bottom))",
      },
    },
  },
};
```

### 6.2 Componentes UI Reusables

**Todos en `components/ui/` y exportados desde `index.ts`:**

```typescript
// components/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
export { Skeleton } from "./Skeleton";
// ... más componentes
```

**Ejemplo Button:**

```typescript
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('px-4 py-2 rounded font-medium transition', {
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
```

---

## 7. Performance

### 7.1 Optimizaciones Next.js

- **Image Optimization**: usar `next/image` con `fill`, `sizes` y `priority`
- **Dynamic Imports**: lazy load componentes pesados
- **Incremental Static Regeneration (ISR)**: caché productos cada 60s
- **Route Prefetch**: precargar rutas probables

```typescript
// Ejemplo: prefetch rutas
import { prefetchQuery } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} onMouseEnter={() => prefetchQuery(['product', product.id])}>
      {product.title}
    </Link>
  );
}
```

### 7.2 Bundle Size

- Auditar con `npm run build` y revisar `.next/static/`
- Evitar librerías pesadas (ej: `moment` → `date-fns`)
- Tree-shake: exports nombrados, no default

---

## 8. Deployment

### 8.1 Environment Variables

```env
# .env.local (desarrollo)
NEXT_PUBLIC_SELLER_API_URL=http://localhost:5001
NEXT_PUBLIC_PAYMENTS_API_URL=http://localhost:5002
NEXT_PUBLIC_SHIPPING_API_URL=http://localhost:5003
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://user:pass@localhost:5432/unihousing_buyer

# .env.production (producción)
NEXT_PUBLIC_SELLER_API_URL=https://seller-api.unihousing.com
NEXT_PUBLIC_PAYMENTS_API_URL=https://payments-api.unihousing.com
NEXT_PUBLIC_SHIPPING_API_URL=https://shipping-api.unihousing.com
```

### 8.2 Build y Start

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start
npm start

# Lint
npm run lint
```

---

## 9. Checklist para PRs

- [ ] Tipado TypeScript strict (sin `any`)
- [ ] Autenticación validada (role check)
- [ ] Manejo de errores con try/catch
- [ ] Queries tipadas y documentadas
- [ ] Componentes con prop types
- [ ] Accessible: `aria-*`, `role`, labels
- [ ] Sin `console.log` en producción (usar logger)
- [ ] Nombres en `snake_case` para JSON APIs
- [ ] Documentación si es función pública

---

## 10. Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk Auth Docs](https://clerk.com/docs)
- [UniHousing Docs](./docs/)
