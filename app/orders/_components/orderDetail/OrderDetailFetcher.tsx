import { notFound } from "next/navigation";
import { TopBar } from "@/app/components/ui";
import { fmtDateLong } from "@/app/lib/utils/format";
import { getOrdenById } from "@/app/lib/db/order";
import { getProductById } from "@/app/lib/api/seller";
import { getShipmentByOrderId } from "@/app/lib/api/shipping";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkIdToUserId";
import { OrderStatusCard } from "./OrderStatusCard";
import { OrderTimeline } from "@/app/components/orders/OrderTimeline";
import { OrderProductCard } from "@/app/components/orders/OrderProductCard";
import type { OrderDetailForUI } from "@/app/lib/types/orders";

interface OrderDetailFetcherProps {
  params: Promise<{ id: string }>;
}

export async function OrderDetailFetcher({ params }: OrderDetailFetcherProps) {
  const { id } = await params;

  const [userId, orden] = await Promise.all([
    getCurrentUserId(),
    getOrdenById(id),
  ]);

  if (!userId) notFound();
  if (!orden || orden.buyerId !== userId) notFound();

  const needsTracking =
    orden.status === "shipping" ||
    orden.status === "delivered" ||
    orden.status === "shipping_failed";

  const [product, shipment] = await Promise.all([
    getProductById(orden.productId),
    needsTracking ? getShipmentByOrderId(orden.id).catch(() => null) : null,
  ]);

  const detail: OrderDetailForUI = {
    id: orden.id,
    status: orden.status,
    date: fmtDateLong(orden.createdAt),
    quantity: orden.quantity,
    unitPrice: Number(orden.unitPrice),
    shippingPrice: Number(orden.shippingPrice),
    total: Number(orden.totalAmount),
    paymentId: orden.paymentId ?? undefined,
    shippingId: orden.shippingId ?? undefined,
    productTitle: product?.title ?? "Producto",
    productThumbnail: product?.images?.[0] ?? "",
    trackingCode: shipment?.tracking_code,
    trackingUrl: shipment?.tracking_url,
    deliveryAddress: shipment?.delivery_address,
  };

  return (
    <div className="pb-12">
      <TopBar back title={detail.id} />
      <div className="p-4 max-w-[600px] mx-auto">
        <OrderStatusCard status={detail.status} date={detail.date} />
        <OrderTimeline
          status={detail.status}
          paymentId={detail.paymentId}
          trackingCode={detail.trackingCode}
          trackingUrl={detail.trackingUrl}
          deliveryAddress={detail.deliveryAddress}
        />
        <OrderProductCard
          status={detail.status}
          productTitle={detail.productTitle}
          productThumbnail={detail.productThumbnail}
          quantity={detail.quantity}
          unitPrice={detail.unitPrice}
          shippingPrice={detail.shippingPrice}
          total={detail.total}
        />
      </div>
    </div>
  );
}
