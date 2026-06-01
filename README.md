[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/8-wwxMvS)

# Gema Market — Buyer App (UniHousing)

## 1. Deploy de producción

🔗 **<https://proyecto-c-buyer-gema-market.vercel.app/>**

## 2. Usuarios de prueba

Usuarios para iniciar sesión vía Clerk:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Buyer (usuario) | `buyer.user+clerk_test@iaw.com` | `iawuser#` |
| Buyer (admin) | `buyer.admin+clerk_test@iaw.com` | `iawuser#` |

Para ambos usuarios, el código de verificación es **`424242`**.

> Son cuentas de test de Clerk (modo desarrollo): el sufijo `+clerk_test` y el código `424242` solo funcionan en la instancia de test de Clerk, no en producción. La instancia de Clerk sigue en modo development y se usa así también en el deploy de Vercel.

## 3. Instrucciones para evaluar la aplicación

- El **catálogo, el detalle de producto y las tiendas** se pueden explorar sin iniciar sesión.
- Para usar el **carrito, favoritos, checkout, pedidos y la cuenta** hay que iniciar sesión con el usuario *Buyer (usuario)* de la tabla de arriba.
- El **panel de administración** está en `/admin` y requiere el usuario *Buyer (admin)*: permite moderar usuarios y órdenes.
- Como las apps de Payments y Shipping no están integradas en este entorno, el panel admin incluye **triggers de simulación** para avanzar el estado de las órdenes (pago confirmado/rechazado, actualización de envío) y poder recorrer el flujo de extremo a extremo.
- La aplicación ya cuenta con **datos precargados** (catálogo, tiendas y órdenes de ejemplo) para probar los distintos casos de uso.
- Para correr el proyecto localmente, ver la [documentación técnica → Cómo correr el proyecto](docs/documentacion-tecnica.md#6-cómo-correr-el-proyecto-localmente).

## 4. Descripción del proyecto

**Gema Market** es la aplicación del **comprador** (_Buyer App_) dentro de **UniHousing**, un marketplace de tipo **C** desarrollado para el [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) (comisión `C`).

UniHousing conecta a estudiantes que llegan a Bahía Blanca y necesitan equipar su departamento con quienes egresan y quieren vender su mobiliario. El ecosistema completo está dividido en cuatro aplicaciones independientes que se comunican vía API (Buyer, Seller, Shipping y Payments), más dos apps transversales (Control Plane y Analytics).

Esta app cubre todo el recorrido del comprador: explorar el catálogo, gestionar el carrito y favoritos, cotizar el envío, iniciar el pago y seguir el estado de sus pedidos. Además incluye un **panel de administración** para moderar usuarios y órdenes.

Está construida con **Next.js 16** (App Router, React 19, Server Actions), **TypeScript**, **Tailwind CSS v4**, **Prisma 7** sobre **PostgreSQL** y **Clerk** como proveedor de identidad. El detalle del stack, la arquitectura, el modelo de datos y los contratos de API está en la [documentación técnica](docs/documentacion-tecnica.md).

## 5. Notas para la corrección

- **Identidad (Lazy Provisioning):** Clerk es la fuente de verdad, pero la app mantiene una tabla `usuario` local que se autoaprovisiona la primera vez que se necesita el `id` interno, de forma race-safe.
- **Checkout transaccional (patrón Saga):** la compra combina escrituras locales con una llamada externa a Payments; ante un fallo se hace rollback de las órdenes creadas para mantener consistencia.
- **Comunicación inter-servicios:** las llamadas máquina-a-máquina se autentican con un header `x-api-key-hash` (hash SHA-256 de `INTERNAL_API_KEY`). En desarrollo, Seller/Shipping/Payments se resuelven con **mocks** locales; en producción se reemplazan por las URLs reales sin tocar el código.
- **Triggers de simulación en admin:** dado que las apps externas no están integradas en este entorno, el panel admin permite simular las notificaciones que enviarían Payments y Shipping para poder avanzar y probar el ciclo completo de una orden.
- **Documentación extendida:** [docs/documentacion-tecnica.md](docs/documentacion-tecnica.md) (stack, arquitectura, modelo de datos, APIs, estructura y setup local). Contrato completo del ecosistema en [docs/apis.md](docs/apis.md).

---

Enunciado completo del proyecto: <https://iaw-2026.github.io/proyecto/>
