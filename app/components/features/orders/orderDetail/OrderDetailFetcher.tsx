import { notFound } from "next/navigation";
import { TopBar } from "@/app/components/ui";
import { getOrdenById } from "@/app/lib/db/orden";
import { getProductById } from "@/app/lib/api/seller";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkId-UserId";
import { OrderStatusCard } from "./OrderStatusCard";
import { OrderTimeline } from "./OrderTimeline";
import { OrderProductCard } from "../OrderProductCard";
import type { OrderDetailForUI } from "@/app/lib/types/orders";

interface OrderDetailFetcherProps {
  id: string;
}

export async function OrderDetailFetcher({ id }: OrderDetailFetcherProps) {
  const userId = await getCurrentUserId();
  if (!userId) notFound();

  const orden = await getOrdenById(id);
  if (!orden || orden.buyerId !== userId) notFound();

  const product = await getProductById(orden.productId);

  const detail: OrderDetailForUI = {
    id: orden.id,
    status: orden.status,
    date: orden.createdAt.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    quantity: orden.quantity,
    unitPrice: Number(orden.unitPrice),
    shippingPrice: Number(orden.shippingPrice),
    total: Number(orden.totalAmount),
    paymentId: orden.paymentId ?? undefined,
    shippingId: orden.shippingId ?? undefined,
    productTitle: product?.title ?? "Producto",
    productThumbnail: product?.thumbnail_url ?? "",
  };

  return (
    <div className="pb-12">
      <TopBar back title={detail.id} />
      <div className="p-4 max-w-[600px] mx-auto">
        <OrderStatusCard status={detail.status} date={detail.date} />
        <OrderTimeline
          status={detail.status}
          paymentId={detail.paymentId}
          shippingId={detail.shippingId}
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
