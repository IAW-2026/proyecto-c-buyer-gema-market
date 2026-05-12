import type { OrderStatus } from "@/app/lib/types/orders";

export const ORDER_STATUS_LABEL: Record<
  OrderStatus,
  {
    label: string;
    tone:
      | "neutral"
      | "sand"
      | "sage"
      | "forest"
      | "success"
      | "warn"
      | "danger"
      | "outline";
  }
> = {
  created: { label: "Creado", tone: "neutral" },
  awaiting_payment: { label: "Pago pendiente", tone: "warn" },
  paid: { label: "Pagado / Preparando", tone: "sand" },
  shipping: { label: "En camino", tone: "forest" },
  delivered: { label: "Entregado", tone: "success" },
  shipping_failed: { label: "Envío fallido", tone: "danger" },
  cancelled: { label: "Cancelado", tone: "danger" },
  refunded: { label: "Reembolsado", tone: "outline" },
  disputed: { label: "En disputa", tone: "warn" },
};

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "created",
  "awaiting_payment",
  "paid",
  "shipping",
];
