"use client";

/**
 * OrdersClient — Componente cliente para el listado de órdenes.
 *
 * Recibe las órdenes ya resueltas desde el Server Component (page.tsx)
 * y maneja la interactividad: tabs "Activos" / "Historial" y navegación
 * al detalle de cada orden.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
  Tabs,
  Card,
  Pill,
  Icon,
  EmptyState,
} from "@/app/components/ui";
import { UH_STATUS_LABEL } from "@/app/mocks/buyer/data";
import { fmtARS } from "@/app/lib/utils/format";
import type { OrdenStatus } from "@prisma/client";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface OrderForUI {
  id: string;
  date: string;
  status: OrdenStatus;
  productTitle: string;
  productThumbnail: string;
  quantity: number;
  unitPrice: number;
  shippingPrice: number;
  total: number;
  paymentId?: string;
  shippingId?: string;
}

interface OrdersClientProps {
  orders: OrderForUI[];
  statusLabels: typeof UH_STATUS_LABEL;
}

// ── Constantes ────────────────────────────────────────────────────────────────

// Estados que se consideran "activos" (el pedido está en curso)
const ACTIVE_STATUSES: OrdenStatus[] = [
  "created",
  "awaiting_payment",
  "paid",
  "shipping",
];

// ── Componente ────────────────────────────────────────────────────────────────

export default function OrdersClient({ orders, statusLabels }: OrdersClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"activos" | "historial">("activos");

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const historialOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status),
  );
  const filtered = tab === "activos" ? activeOrders : historialOrders;

  return (
    <div className="pb-6">
      <TopBar title="Mis pedidos" />

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

      <div className="p-4 flex flex-col gap-3">
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
          filtered.map((o) => {
            const st = statusLabels[o.status];
            return (
              <Card
                key={o.id}
                padding={16}
                onClick={() => router.push(`/orders/${o.id}`)}
                hover
              >
                {/* Cabecera: ID + estado */}
                <div className="flex justify-between items-center mb-2.5">
                  <div className="text-xs font-mono text-ink-3 truncate max-w-[55%]">
                    {o.id}
                  </div>
                  <Pill tone={st.tone} size="sm">
                    {st.label}
                  </Pill>
                </div>

                {/* Nombre del producto */}
                <div className="text-sm font-medium mb-2 truncate">
                  {o.productTitle}
                  {o.quantity > 1 && (
                    <span className="text-ink-3 font-normal">
                      {" "}
                      × {o.quantity}
                    </span>
                  )}
                </div>

                {/* Pie: fecha + total + chevron */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[13px] text-ink-3">{o.date}</div>
                    <div className="text-base font-semibold">
                      {fmtARS(o.total)}
                    </div>
                  </div>
                  <Icon name="chevronRight" size={18} className="text-ink-3" />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
