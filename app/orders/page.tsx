import { Suspense } from "react";
import { OrdersFetcher } from "@/app/components/features/orders/OrdersFetcher";
import { OrdersSkeleton } from "@/app/components/features/orders/OrdersSkeleton";

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersFetcher />
    </Suspense>
  );
}
