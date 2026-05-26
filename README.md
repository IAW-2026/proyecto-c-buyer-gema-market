[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/8-wwxMvS)

# Gema Market — App del Comprador

Aplicación **Buyer** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `C`.

Esta app corresponde al rol del **comprador** en el proyecto de tipo **C (Marketplace)**.

---

## ¿De qué se trata?

Gema Market es una plataforma de compras online donde los usuarios pueden explorar productos de distintos vendedores, agregarlos al carrito, y completar una compra con envío a domicilio.

Hay dos tipos de usuarios:

- **Comprador** — puede navegar el catálogo, gestionar su carrito, hacer pedidos y ver el historial de sus compras.
- **Administrador** — tiene acceso a un panel para ver y gestionar usuarios y órdenes del sistema.

---

## Funcionalidades principales

### Para el comprador

**Explorar productos**
Desde la página de inicio se ve una grilla de productos con la posibilidad de filtrar por categoría, precio, nombre y más. Cada producto tiene su propia página de detalle con imágenes, descripción y botón para agregar al carrito.

**Tiendas (Shops)**
Cada vendedor tiene su propia página de tienda con sus productos organizados por categoría.

**Carrito de compras**
El usuario puede agregar productos, ver el resumen de lo que tiene y proceder al checkout.

**Checkout en 2 pasos**
1. Ingresar o confirmar la dirección de entrega.
2. Ver el resumen con el precio de cada producto más el costo de envío cotizado en tiempo real. Al confirmar, se genera la orden y se redirige al pago.

**Mis pedidos**
El usuario puede ver todos sus pedidos activos e historial. Cada pedido muestra su estado actual:

| Estado | Significado |
|---|---|
| Creado | El pedido fue registrado |
| Pago pendiente | Esperando confirmación del pago |
| Pagado / Preparando | El vendedor está preparando el pedido |
| En camino | El paquete fue despachado |
| Entregado | El pedido llegó a destino |
| Envío fallido | Hubo un problema con el envío |
| Cancelado | El pedido fue cancelado |

**Favoritos**
Los usuarios pueden guardar productos para verlos después.

**Mi cuenta**
El usuario puede ver y editar su información personal y dirección de entrega predeterminada.

---

### Para el administrador

El administrador accede a `/admin` y puede:

- Ver estadísticas generales (cantidad de usuarios y órdenes).
- Listar, ver detalle y gestionar usuarios.
- Listar y ver el detalle de todas las órdenes del sistema.

---

## Estructura del proyecto

```
app/
├── page.tsx                  # Página de inicio (catálogo de productos)
├── product/[id]/             # Detalle de un producto
├── shop/[id]/                # Tienda de un vendedor
├── cart/                     # Carrito de compras
├── checkout/                 # Flujo de pago (dirección → resumen → pago)
├── orders/                   # Mis pedidos y detalle de cada orden
├── favorites/                # Productos guardados
├── account/                  # Perfil del usuario
├── admin/                    # Panel de administración
│   ├── page.tsx              # Dashboard con estadísticas
│   ├── users/                # Gestión de usuarios
│   └── orders/               # Gestión de órdenes
├── api/                      # Endpoints internos (pagos, envíos, etc.)
├── components/               # Componentes reutilizables (UI, carrito, órdenes)
└── lib/                      # Lógica compartida (base de datos, acciones, tipos)
```

---

## Cómo correr el proyecto

1. Clonar el repositorio e instalar las dependencias:

```bash
pnpm install
```

2. Configurar las variables de entorno (`.env.local`) con las credenciales de la base de datos, Clerk y los servicios externos.

3. Levantar el servidor de desarrollo:

```bash
pnpm dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Tecnologías utilizadas

- **Next.js 15** — framework principal (App Router)
- **TypeScript** — tipado estático
- **Tailwind CSS** — estilos
- **Prisma** — ORM para la base de datos PostgreSQL
- **Clerk** — autenticación y gestión de usuarios
- **Zod** — validación de formularios y esquemas

---

Enunciado completo del proyecto: <https://iaw-2026.github.io/proyecto/>
