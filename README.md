[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/8-wwxMvS)

# Documentación de Gema Market — Buyer App

## 1. Introducción

**Gema Market** es la aplicación del **comprador** (_Buyer App_) dentro de **UniHousing**, un marketplace de tipo **C** desarrollado para el [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) (comisión `C`).

UniHousing conecta a estudiantes que llegan a Bahía Blanca y necesitan equipar su departamento con quienes egresan y quieren vender su mobiliario. El ecosistema completo está dividido en cuatro aplicaciones independientes que se comunican vía API (Buyer, Seller, Shipping y Payments), más dos apps transversales (Control Plane y Analytics).

Esta app cubre todo el recorrido del comprador: explorar el catálogo, gestionar el carrito y favoritos, cotizar el envío, iniciar el pago y seguir el estado de sus pedidos. Además incluye un **panel de administración** para moderar usuarios y órdenes. En este documento se detallan el stack, las decisiones de arquitectura, el modelo de datos y los contratos de API.

---

## 2. Stack Tecnológico

- **Framework Core:** Next.js 16 (App Router) con React 19, aprovechando Server Components, Server Actions y `<Suspense>` para streaming de UI.
- **Lenguaje:** TypeScript, con tipado estricto en toda la base de código.
- **Estilos:** Tailwind CSS v4, con un set propio de componentes UI (`Button`, `Card`, `Input`, `Toast`, `Skeleton`, etc.).
- **Base de Datos:** PostgreSQL.
- **ORM:** Prisma 7 (`@prisma/client`) sobre el adapter `@prisma/adapter-pg` (`pg`), para acceso a datos fuertemente tipado.
- **Autenticación:** Clerk (`@clerk/nextjs`) como proveedor centralizado de identidad para todo el ecosistema UniHousing.
- **Validación:** Zod, para validar formularios, payloads de Server Actions y bodies de las API entrantes.
- **IDs:** `ulid`, para generar identificadores ordenables con prefijo (`usr_…`, `ord_…`).
- **Utilidades de UI:** `clsx` + `tailwind-merge` para componer clases, `use-debounce` para los filtros de búsqueda.
- **Gestor de Paquetes:** pnpm.

---

## 3. Decisiones de Arquitectura

### 3.1. Arquitectura por capas (Server-first)

La lógica se organiza en capas con responsabilidades bien separadas, todas ejecutándose en el servidor:

- **Server Actions (`app/lib/actions/*`):** orquestan los casos de uso (carrito, favoritos, checkout, cuenta, acciones de admin). Son el único punto de entrada para mutaciones desde la UI.
- **Capa de datos (`app/lib/db/*`):** encapsula todas las queries de Prisma sobre las tablas propias (`usuario`, `orden`, `carrito`, `favorito`).
- **Clientes de APIs externas (`app/lib/api/*`):** clientes HTTP tipados hacia Seller, Shipping y Payments. Aíslan la comunicación inter-servicios del resto de la app.
- **Validación (`app/lib/schemas/*`):** esquemas Zod reutilizados tanto en Server Actions como en las API entrantes.

Los Client Components (`"use client"`) se limitan a interactividad: filtros, formularios, navegación del carrito y feedback con toasts.

### 3.2. Sincronización de usuarios ("Lazy Provisioning")

Aunque Clerk es la fuente de verdad de la identidad, la Buyer App mantiene su propia tabla `usuario` (cache local) para poder vincular órdenes, carrito y favoritos. Para no exigir un alta manual tras el registro, implementamos **Lazy Provisioning** en [getCurrentUserId](app/lib/auth/mapClerkIdToUserId.ts): la primera vez que una request necesita el `id` interno del usuario, si no existe la fila se crea automáticamente a partir de los datos de Clerk.

Detalles relevantes de la implementación:

- **Race-safety:** el par `findUnique` + `create` no es atómico. Si dos requests paralelas (típico con el prefetch de Next.js justo después del signup) intentan crear la misma fila, el segundo `create` falla con el error `P2002` de Prisma y se resuelve refetcheando la fila ya creada.
- **Memoización:** la función está envuelta en `React.cache()`, garantizando una sola ejecución por render de servidor.

### 3.3. Comunicación inter-servicios y autenticación entre apps

La Buyer App **consume** datos de las otras apps (catálogo de Seller, cotizaciones de Shipping, órdenes de pago de Payments) y **expone** endpoints que esas apps llaman de vuelta (confirmación de pago, estado de envío).

Para las llamadas máquina-a-máquina usamos un header `x-api-key-hash`: en lugar de viajar la clave en texto plano, se envía su hash **SHA-256** de la variable `INTERNAL_API_KEY` (ver [hmac.ts](app/lib/utils/hmac.ts)). Cada endpoint entrante valida ese header con `validateApiKey` antes de procesar el body.

Durante el desarrollo, los clientes apuntan a route handlers locales (`/api/seller/*`, `/api/shipping/*`, `/api/payments/*`) respaldados por **mocks** (`app/mocks/*`). En producción se reemplazan por las URLs reales (`SELLER_API_URL`, `SHIPPING_API_URL`, `PAYMENTS_API_URL`), sin tocar el resto del código.

### 3.4. Checkout transaccional con rollback (patrón Saga)

El alta de una compra mezcla escrituras locales con una llamada HTTP externa (Payments), que no puede ser transaccional. Para mantener consistencia, [createCheckoutAction](app/lib/actions/checkout.ts) ejecuta el flujo en **tres fases**:

1. **Fase 1 — `prisma.$transaction`:** crea todas las órdenes atómicamente (estado `created`). Si falla cualquier `create`, ninguna se persiste.
2. **Fase 2 — llamada a Payments App:** crea la orden de pago. Si falla, se hace **rollback** marcando todas las órdenes creadas como `cancelled`.
3. **Fase 3 — `prisma.$transaction`:** asocia el `payment_id`, pasa las órdenes a `awaiting_payment` y elimina el carrito (el `CASCADE` borra sus items en una sola operación). Si esta fase falla, el carrito queda intacto para reintentar.

El **`order_id` se genera acá** (ULID con prefijo `ord_`) y es el identificador correlacional global: Seller, Shipping y Payments lo persisten como FK lógica para trazabilidad inter-servicios.

### 3.5. Control de acceso y panel de administración

El acceso se controla en el middleware ([proxy.ts](proxy.ts)) con `clerkMiddleware`:

- Las rutas públicas (home, detalle de producto, sign-in/up y las API entrantes) no requieren sesión.
- El resto exige autenticación con `auth.protect()`.
- Las rutas `/admin/*` exigen además el rol `admin_buyer` (leído de `publicMetadata` del JWT de Clerk); si no lo tiene, se redirige al home.

Para poder probar el flujo de extremo a extremo sin las apps reales, el panel admin incluye **triggers de simulación** ([triggersAdmin.ts](app/lib/actions/triggersAdmin.ts)) que invocan los propios endpoints entrantes de la Buyer App (pago confirmado/rechazado, actualización de envío), reproduciendo lo que en producción enviarían Payments y Shipping.

### 3.6. Caché y rendimiento

- **Caché de datos remotos:** las lecturas al catálogo usan `next: { revalidate }` con TTLs según volatilidad (60s para listados, 30s para detalle, 12h para categorías), evitando golpear la Seller App en cada navegación.
- **Skeletons con `<Suspense>`:** en lugar de un `loading.tsx` global, cada sección que espera datos (catálogo, carrito, checkout, órdenes, cuenta) tiene su propio componente _Skeleton_, mostrando la animación de carga solo en la parte pendiente.
- **`revalidatePath`:** tras cada mutación (carrito, favoritos, checkout, acciones de admin) se invalida el path afectado para que la UI refleje el cambio sin recargar.

---

## 4. Modelo de Datos (Base de Datos)

La base es PostgreSQL gestionada con Prisma. El esquema gira en torno al `usuario` (comprador) y su entidad maestra, la `orden`. Convención: las PK internas son **ULIDs con prefijo** y los IDs de otras apps se guardan como **FK lógicas** (se validan vía API, no por constraint de BD).

### `usuario` (cache de Clerk)

Núcleo de identidad local. Se sincroniza con Clerk vía Lazy Provisioning.

- **Campos:** `id` (PK, `usr_…`), `clerk_user_id` (único, fuente de verdad), `email`, `full_name`, `phone_number`, `address` (JSON), `role` (`buyer`), `created_at`.
- **Relaciones:** un usuario tiene muchas órdenes, un carrito y muchos favoritos.

### `orden` (entidad maestra del flujo)

Cada producto comprado genera una orden. Su `id` se expone como `order_id` al resto del ecosistema.

- **Campos:** `id` (PK), `buyer_id` (FK → `usuario`), `seller_id` y `product_id` (FK lógicas → Seller), `quantity`, `unit_price`, `quote_id` (FK lógica → Shipping), `shipping_price`, `total_amount`, `currency`, `status`, `payment_id` (FK lógica → Payments), `shipping_id` (FK lógica → Shipping), `created_at`, `updated_at`.
- **Estados (`status`):** `created` → `awaiting_payment` → `paid` → `picked_up` → `shipping` → `delivered`, más `shipping_failed` y `cancelled`.

### `carrito` e `item_carrito`

- **`carrito`:** uno por comprador (`buyer_id` único). Eliminarlo borra sus items por `CASCADE`.
- **`item_carrito`:** `product_id` (FK lógica → Seller) + `quantity`. La restricción `@@unique([carrito_id, product_id])` garantiza que un producto aparezca una sola vez por carrito.

### `favorito`

Tabla con **PK compuesta** `(buyer_id, product_id)`: vincula a un comprador con un producto guardado de la Seller App.

---

## 5. Documentación de APIs

> **Convenciones:** los campos JSON usan `snake_case`. El parámetro de ruta correlacional es `:order_id` (generado por esta app). Las rutas máquina-a-máquina requieren el header `x-api-key-hash` (hash SHA-256 de `INTERNAL_API_KEY`).

### 5.1. Endpoints expuestos (consumidos por otras apps)

| Método | Ruta | Consumido por | Descripción |
|--------|------|---------------|-------------|
| `POST` | `/api/buyer/pagos/:payment_id/confirmado` | Payments | Notifica pago aprobado → las órdenes pasan a `paid`. |
| `POST` | `/api/buyer/pagos/:payment_id/rechazado` | Payments | Notifica rechazo/cancelación → libera las órdenes. |
| `POST` | `/api/buyer/ordenes/:order_id/estado-envio` | Shipping | Actualiza el estado logístico de la orden. |
| `POST` | `/api/buyer/:buyer_id` | Shipping | Devuelve los datos del comprador (incluye dirección). |

Ejemplo de body para `confirmado`:

```json
{
  "payment_id": "pay_01HXYZ...",
  "orders": [
    {
      "order_id": "ord_01HXYZ...",
      "mp_payment_id": "1234567890",
      "status": "approved",
      "amount": 15000.0,
      "currency": "ARS",
      "paid_at": "2026-04-17T14:32:00Z"
    }
  ]
}
```

Todas validan el `x-api-key-hash` (responden `401` si no coincide) y el body con Zod (`400` si es inválido). Respuesta de éxito: `{ "ok": true }`.

### 5.2. Endpoints administrativos (Etapa 3)

Protegidos por rol `admin_buyer` y consumidos por el Control Plane y el Analytics Dashboard:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/buyer/admin/ordenes` | Listado paginado y filtrable de todas las órdenes. |
| `GET` | `/api/buyer/admin/stats` | Métricas agregadas (total de órdenes, por estado, ticket promedio). |

### 5.3. Endpoints consumidos (otras apps)

A través de los clientes en `app/lib/api/*`:

- **Seller App:** catálogo (`GET /productos`), detalle (`GET /productos/:id`), lote (`POST /productos/batch`), categorías y tiendas.
- **Shipping App:** cotización de envío (`POST /cotizaciones`) y consulta de envío (`GET /envios/:order_id`).
- **Payments App:** creación de la orden de pago (`POST /ordenes-de-pago`).

> El contrato completo del ecosistema está documentado en [docs/apis.md](docs/apis.md).

---

## 6. Estructura del proyecto

```
app/
├── page.tsx                  # Home: catálogo con filtros
├── product/[id]/             # Detalle de producto
├── shop/[id]/                # Tienda de un vendedor
├── cart/                     # Carrito de compras
├── checkout/                 # Checkout en 2 pasos (dirección → resumen y pago)
├── orders/                   # Mis pedidos y detalle
├── favorites/                # Productos guardados
├── account/                  # Perfil del comprador
├── admin/                    # Panel de administración (usuarios y órdenes)
├── api/                      # Endpoints entrantes + route handlers de mocks
├── components/               # Componentes UI reutilizables
├── mocks/                    # Datos simulados de Seller/Shipping/Payments (dev)
└── lib/
    ├── actions/              # Server Actions (casos de uso)
    ├── api/                  # Clientes HTTP de apps externas
    ├── auth/                 # Identidad y permisos (lazy provisioning, requireAdmin)
    ├── db/                   # Queries Prisma
    ├── schemas/              # Validación Zod
    └── utils/                # Utilidades (ulid, hmac, formato, paginación)
prisma/
└── schema.prisma            # Esquema de la base de datos
```

---

## 7. Cómo correr el proyecto

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Crear `.env.local` a partir de [.env.example](.env.example) con las credenciales de la base de datos, Clerk, las URLs de las apps externas y `INTERNAL_API_KEY`.

3. Generar el cliente de Prisma y aplicar el esquema:

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

4. Levantar el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000).

---

## 8. Credenciales de prueba

Usuarios de prueba para iniciar sesión vía Clerk:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Buyer (usuario) | `buyer.user+clerk_test@unihousing.com` | `@BuyerUserPassword` |
| Buyer (admin) | `buyer.admin+clerk_test@unihousing.com` | `@BuyerAdminPassword` |

Para ambos usuarios, el código de verificación es `424242`.

> Son cuentas de test de Clerk (modo desarrollo): el sufijo `+clerk_test` y el código `424242` solo funcionan en la instancia de test de Clerk, no en producción.

---

Enunciado completo del proyecto: <https://iaw-2026.github.io/proyecto/>
