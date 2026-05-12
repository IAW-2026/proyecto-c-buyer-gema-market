import { Suspense } from "react";
import { OrderDetailFetcher } from "@/app/components/features/orders/orderDetail/OrderDetailFetcher";
import { OrderDetailSkeleton } from "@/app/components/features/orders/orderDetail/OrderDetailSkeleton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailFetcher id={id} />
    </Suspense>
  );
}
