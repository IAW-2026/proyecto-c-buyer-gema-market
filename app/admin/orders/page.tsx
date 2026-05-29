import { Suspense } from "react";
import { SectionTitle } from "@/app/components/ui";
import { ADMIN_ORDERS_PAGE_SIZE } from "@/app/lib/constants/pagination";
import { OrdersListContent } from "./_components/OrdersListContent";
import { OrdersTableSkeleton } from "./_components/OrdersTableSkeleton";

type SearchParams = Promise<{ page?: string | string[]; search?: string | string[] }>;

function OrdersPageSkeleton() {
  return (
    <>
      <SectionTitle eyebrow="…">Órdenes</SectionTitle>
      <OrdersTableSkeleton rows={ADMIN_ORDERS_PAGE_SIZE} />
    </>
  );
}

export default function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersListContent searchParams={searchParams} />
    </Suspense>
  );
}
