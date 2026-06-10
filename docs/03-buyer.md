# Plan de ejecución — Etapa 3 · Buyer App (`proyecto-c-buyer-gema-market`)

> **Orden de ejecución:** 3 de 6 (antes de Control Plane 05 y Analytics 06).
> **Disputas: fuera de alcance.** **Marca:** UniHousing. **Auth de integración:** API-key (`x-api-key-hash`).

## Objetivo

Buyer es el app **más adelantado en admin**: ya expone `GET /api/buyer/admin/ordenes` y
`GET /api/buyer/admin/stats`. Los cambios son acotados:
1. Que esos endpoints (y los nuevos) **acepten la `INTERNAL_API_KEY`** además del rol Clerk `admin_buyer`
   (hoy solo validan el rol → el Control Plane/Analytics, que llaman server-to-server, no tienen sesión Clerk).
2. Agregar **detalle + gestión de una orden** y **listado de usuarios** para la vista consolidada.

## Contexto del código (lo que ya existe y se reutiliza)

- **API-key:** `app/lib/utils/hmac.ts → validateApiKey(request)` (SHA-256 hex mayúsculas de
  `INTERNAL_API_KEY`). **Ya existe** — solo falta usarlo en los `/admin/*`.
- **Rol admin:** `app/lib/auth/permissions.ts → isAdmin()` (Clerk `sessionClaims.metadata.role === "admin_buyer"`).
- **Data-access admin (existe):** `app/lib/db/order.ts` → `getOrdenesAdminApi`, `countOrdenesAdminApi`,
  `getOrdenesStatsAdmin`, `getOrdenById`, `updateOrden`.
- **Modelo** (`prisma/schema.prisma`): `Orden`: `id (ord_/usa VarChar30)`, `buyerId`, `sellerId`,
  `productId`, `quantity`, `unitPrice Decimal`, `quoteId?`, `shippingPrice Int`, `totalAmount Decimal`,
  `currency`, **`status OrdenStatus`** (`created|awaiting_payment|paid|picked_up|shipping|delivered|
  shipping_failed|cancelled`), `paymentId?`, `shippingId?`, `createdAt`, `updatedAt`.
  `Usuario`: `id (usr_)`, `clerkUserId`, `email`, `fullName`, `phoneNumber?`, `address Json?`, `role (buyer)`,
  `createdAt`.

> **Nota de dominio:** el enum `OrdenStatus` **no** tiene `refunded`/`disputed` (sí `cancelled`). No
> asumir esos estados.

## Cambio transversal: gate dual (API-key OR rol Clerk)

Crear un helper reutilizable `app/lib/auth/adminGate.ts`:
```ts
import { isAdmin } from "@/app/lib/auth/permissions";
import { validateApiKey } from "@/app/lib/utils/hmac";

/** true si la request es de un admin (sesión Clerk) o trae la INTERNAL_API_KEY válida. */
export async function isAdminRequest(request: Request): Promise<boolean> {
  if (validateApiKey(request)) return true;   // server-to-server (Control Plane / Analytics)
  return await isAdmin();                       // humano con rol admin_buyer en la propia UI
}
```
Aplicarlo en **todas** las rutas `/api/buyer/admin/*`:
```ts
if (!(await isAdminRequest(req))) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

---

## Endpoints

### 1) `GET /api/buyer/admin/ordenes` (EXISTE) — agregar gate dual

**Archivo:** `app/api/buyer/admin/ordenes/route.ts`. Reemplazar `if (!(await isAdmin()))` por
`if (!(await isAdminRequest(req)))`. Sin otros cambios (paginación/filtros ya correctos). Response actual:
`{ items:[{ order_id, buyer_id, seller_id, product_id, total_amount, status, created_at }], page,
page_size, total, sort_by, order }`.

### 2) `GET /api/buyer/admin/stats` (EXISTE) — agregar gate dual

**Archivo:** `app/api/buyer/admin/stats/route.ts`. Mismo cambio de gate. Confirmar que la respuesta de
`getOrdenesStatsAdmin` cumple el contrato y mapearlo si hace falta:
```json
{ "total_orders": 256,
  "orders_by_status": { "created": 12, "awaiting_payment": 5, "paid": 34, "picked_up": 3,
                        "shipping": 18, "delivered": 170, "shipping_failed": 2, "cancelled": 12 },
  "average_ticket": 14250.5, "currency": "ARS" }
```
> `orders_by_status` debe cubrir **todos** los valores del enum (incl. `picked_up`, `shipping_failed`).

### 3) `GET /api/buyer/admin/ordenes/:order_id` (NUEVO) — detalle

**Archivo:** `app/api/buyer/admin/ordenes/[order_id]/route.ts`. Gate dual. Reutiliza `getOrdenById`.
**Consumido por:** Control Plane (vista de orden correlacionada con pago + envío por `order_id`).
**200:**
```json
{ "order_id": "ord_…", "buyer_id": "usr_…", "seller_id": "usr_…", "product_id": "prd_…",
  "quantity": 2, "unit_price": 7500.0, "quote_id": "qte_…", "shipping_price": 3500,
  "total_amount": 18500.0, "currency": "ARS", "status": "paid",
  "payment_id": "pay_…", "shipping_id": "shp_…",
  "created_at": "2026-04-12T08:00:00Z", "updated_at": "2026-04-12T09:00:00Z" }
```
**404** si no existe.

### 4) `PATCH /api/buyer/admin/ordenes/:order_id` (NUEVO) — gestión/soporte

**Mismo archivo** que (3). Gate dual. Reutiliza `updateOrden`. **Consumido por:** Control Plane.
```ts
const BodySchema = z.object({ status: z.enum(['cancelled']) });   // solo transiciones seguras
```
Solo permitir `cancelled` desde estados no terminales (no cancelar `delivered`). Documentar las
transiciones permitidas. **200:** `{ "order_id": "ord_…", "status": "cancelled" }` · 404 · 422 si la
transición es inválida.
> El Control Plane **no** orquesta refund de pago ni reversa de envío (disputas/refunds fuera de alcance):
> este PATCH solo marca el estado en Buyer. Si en el futuro se quiere refund, se coordina con Payments.

### 5) `GET /api/buyer/admin/usuarios` (NUEVO) — caché de Clerk

**Archivo:** `app/api/buyer/admin/usuarios/route.ts`. Gate dual. Query: `q` (email/fullName), `page`,
`page_size`, `sort_by (created_at)`, `order`. Crear `getUsuariosAdmin(opts)` en `app/lib/db/user.ts`
(o donde viva el acceso a `Usuario`).
```json
{ "items": [{ "user_id": "usr_…", "clerk_user_id": "user_…", "email": "c@p.com",
  "full_name": "Carlos Pérez", "phone_number": "291…", "role": "buyer", "created_at": "…" }],
  "page": 1, "page_size": 20, "total": 300 }
```

### 6) (Opcional) `GET /api/buyer/admin/stats/timeseries`

`{ granularity, series:[{bucket,value}] }` por `created_at` (órdenes) o `totalAmount` (revenue), con
`date_trunc`. Habilita gráficos de tendencia en Analytics.

---

## Cambios fuera de los endpoints

- **`docs/apis.md` (repo Buyer):** actualizar la nota de auth de la sección admin → "acepta `INTERNAL_API_KEY`
  (server-to-server) **o** rol Clerk `admin_buyer`". Agregar los endpoints nuevos.
- **`.env.example`:** `INTERNAL_API_KEY` ya está; confirmar.
- **Middleware (`proxy.ts`):** asegurarse de que `/api/buyer/admin/*` no quede bloqueado para requests sin
  sesión Clerk (el gate de auth real pasa a ser el handler con `isAdminRequest`). Si `proxy.ts` exige
  sesión en `/api/buyer/admin/*`, excluir ese path (las llamadas server-to-server no tienen cookie Clerk).

## Tests

No hay suite automatizada. Documentar `curl` para cada endpoint (con y sin `x-api-key-hash`) y validar:
- `/admin/ordenes` y `/admin/stats` responden **200 con API-key** (antes daban 403).
- `ordenes/:id` GET 200/404; PATCH cancela y rechaza transición inválida (422).
- `usuarios` pagina correctamente.

## Checklist de ejecución

- [ ] `app/lib/auth/adminGate.ts` (`isAdminRequest`).
- [ ] Aplicar gate dual en `ordenes` y `stats` existentes.
- [ ] `ordenes/[order_id]` (GET + PATCH) y `usuarios` nuevos (+ `stats/timeseries` opcional).
- [ ] Ajustar `proxy.ts` si bloquea `/api/buyer/admin/*` sin sesión.
- [ ] `docs/apis.md` + repo de docs (branch + PR + merge).
- [ ] Deploy Vercel con `INTERNAL_API_KEY`.
