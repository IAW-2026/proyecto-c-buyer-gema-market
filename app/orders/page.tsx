import { Suspense } from "react";
import { TopBar } from "@/app/components/ui";
import { OrdersFetcher } from "./_components/OrdersFetcher";
import { OrdersSkeleton } from "./_components/OrdersSkeleton";

export default function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; tab?: string | string[] }>;
}) {
  return (
    <>
      <TopBar title="Mis pedidos" back />
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersFetcher searchParams={searchParams} />
      </Suspense>
    </>
  );
}
