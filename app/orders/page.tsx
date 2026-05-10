/**
 * Página de órdenes — Server Component con datos reales.
 *
 * Obtiene las órdenes del comprador autenticado desde la BD y
 * resuelve los títulos de productos usando la Seller App (getProductsBatch).
 *
 * Las tabs "Activos" / "Historial" se manejan en el Client Component
 * OrdersClient para mantener interactividad sin perder SSR.
 */

import { getAccountData } from "@/app/lib/helpers/account";
import { getOrdenesByBuyerId } from "@/app/lib/db/orden";
import { getProductsBatch } from "@/app/lib/services/seller";
import { UH_STATUS_LABEL } from "@/app/mocks/buyer/data";
import OrdersClient from "@/app/components/features/orders/OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // 1. Obtener el usuario actual
  const usuario = await getAccountData();
  if (!usuario) {
    // Si no está autenticado, mostrar lista vacía (el middleware debería redirigir antes)
    return <OrdersClient orders={[]} statusLabels={UH_STATUS_LABEL} />;
  }

  // 2. Obtener órdenes de la BD
  const ordenes = await getOrdenesByBuyerId(usuario.id);

  if (ordenes.length === 0) {
    return <OrdersClient orders={[]} statusLabels={UH_STATUS_LABEL} />;
  }

  // 3. Resolver títulos de productos (uno por orden; en este MVP cada orden = 1 producto)
  const productIds = [...new Set(ordenes.map((o) => o.productId))];
  const { items: products } = await getProductsBatch(productIds);
  const productMap = new Map(products.map((p) => [p.product_id, p]));

  // 4. Mapear órdenes al formato que espera el cliente
  const ordersForUI = ordenes.map((o) => {
    const product = productMap.get(o.productId);
    return {
      id: o.id,
      date: o.createdAt.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: o.status,
      productTitle: product?.title ?? "Producto",
      productThumbnail: product?.thumbnail_url ?? "",
      quantity: o.quantity,
      unitPrice: Number(o.unitPrice),
      shippingPrice: o.shippingPrice,
      total: Number(o.totalAmount),
      paymentId: o.paymentId ?? undefined,
      shippingId: o.shippingId ?? undefined,
    };
  });

  return <OrdersClient orders={ordersForUI} statusLabels={UH_STATUS_LABEL} />;
}
