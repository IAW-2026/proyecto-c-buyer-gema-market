import { getCurrentUserId } from "@/app/lib/auth/mapClerkId-UserId";
import { getOrdenesByBuyerId } from "@/app/lib/db/orden";
import { getProductsBatch } from "@/app/lib/api/seller";
import OrdersClient from "./OrdersClient";
import type { OrderForUI } from "@/app/lib/types/orders";

export async function OrdersFetcher() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return <OrdersClient orders={[]} />;
  }

  const ordenes = await getOrdenesByBuyerId(userId);
  if (ordenes.length === 0) {
    return <OrdersClient orders={[]} />;
  }

  const productIds = [...new Set(ordenes.map((o) => o.productId))];
  const { products } = await getProductsBatch(productIds);
  const productMap = new Map(products.map((p) => [p.product_id, p]));

  const orders: OrderForUI[] = ordenes.map((o) => {
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
      shippingPrice: Number(o.shippingPrice),
      total: Number(o.totalAmount),
      paymentId: o.paymentId ?? undefined,
      shippingId: o.shippingId ?? undefined,
    };
  });

  return <OrdersClient orders={orders} />;
}
