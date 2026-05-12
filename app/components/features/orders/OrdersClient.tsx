"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, Tabs, EmptyState } from "@/app/components/ui";
import { OrderCard } from "./OrderCard";
import { ACTIVE_ORDER_STATUSES } from "@/app/lib/constants/orders";
import type { OrderForUI } from "@/app/lib/types/orders";

interface OrdersClientProps {
  orders: OrderForUI[];
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"activos" | "historial">("activos");

  const activeOrders = orders.filter((o) =>
    ACTIVE_ORDER_STATUSES.includes(o.status),
  );
  const historialOrders = orders.filter(
    (o) => !ACTIVE_ORDER_STATUSES.includes(o.status),
  );
  const filtered = tab === "activos" ? activeOrders : historialOrders;

  return (
    <div className="pb-6">
      <TopBar title="Mis pedidos" back />

      <div className="px-4">
        <Tabs
          tabs={[
            { id: "activos", label: "Activos", count: activeOrders.length },
            {
              id: "historial",
              label: "Historial",
              count: historialOrders.length,
            },
          ]}
          active={tab}
          onChange={(t) => setTab(t as "activos" | "historial")}
        />
      </div>

      <div
        role="tabpanel"
        id={`tab-panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="p-4 flex flex-col gap-3"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="box"
            title="Sin pedidos por ahora"
            body={
              tab === "activos"
                ? "Cuando hagas una compra aparece acá."
                : "Tu historial está vacío."
            }
          />
        ) : (
          filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onClick={() => router.push(`/orders/${o.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
