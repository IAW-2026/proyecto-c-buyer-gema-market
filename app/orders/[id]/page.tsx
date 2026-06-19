import { Suspense } from "react";
import { OrderDetailFetcher } from "@/app/orders/_components/orderDetail/OrderDetailFetcher";
import { OrderDetailSkeleton } from "@/app/orders/_components/orderDetail/OrderDetailSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailFetcher params={params} />
    </Suspense>
  );
}
