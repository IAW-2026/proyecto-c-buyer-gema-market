"use client";

import { useTransition } from "react";
import { Button } from "@/app/components/ui";
import {
  triggerPaymentConfirmed,
  triggerPaymentRejected,
  triggerShippingUpdate,
} from "@/app/lib/actions/triggersAdmin";
import type { OrderStatus } from "@/app/lib/types/orders";

interface Props {
  orderId: string;
  status: OrderStatus;
  paymentId?: string;
  shippingId?: string;
  totalAmount: number;
  currency: string;
}

export function OrderStatusActions({
  orderId,
  status,
  paymentId,
  shippingId,
  totalAmount,
  currency,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const simPaymentId = paymentId ?? `sim-pay-${orderId}`;

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) alert(result.error ?? "Error desconocido.");
    });
  }

  if (status === "awaiting_payment") {
    return (
      <ActionPanel label="Simular pago">
        <Button
          variant="primary"
          size="sm"
          loading={isPending}
          onClick={() =>
            run(() =>
              triggerPaymentConfirmed(
                orderId,
                simPaymentId,
                totalAmount,
                currency,
              ),
            )
          }
        >
          Pago aprobado
        </Button>
        <Button
          variant="danger"
          size="sm"
          loading={isPending}
          onClick={() =>
            run(() => triggerPaymentRejected(orderId, simPaymentId))
          }
        >
          Pago rechazado
        </Button>
      </ActionPanel>
    );
  }

  if (status === "paid") {
    return (
      <ActionPanel label="Simular envío">
        <Button
          variant="primary"
          size="sm"
          loading={isPending}
          onClick={() =>
            run(() => triggerShippingUpdate(orderId, "picked_up", shippingId))
          }
        >
          Paquete retirado
        </Button>
      </ActionPanel>
    );
  }

  if (status === "picked_up") {
    return (
      <ActionPanel label="Simular envío">
        <Button
          variant="primary"
          size="sm"
          loading={isPending}
          onClick={() =>
            run(() => triggerShippingUpdate(orderId, "in_transit", shippingId))
          }
        >
          En camino
        </Button>
      </ActionPanel>
    );
  }

  if (status === "shipping") {
    return (
      <ActionPanel label="Simular envío">
        <Button
          variant="primary"
          size="sm"
          loading={isPending}
          onClick={() =>
            run(() => triggerShippingUpdate(orderId, "delivered", shippingId))
          }
        >
          Marcar entregado
        </Button>
        <Button
          variant="danger"
          size="sm"
          loading={isPending}
          onClick={() =>
            run(() => triggerShippingUpdate(orderId, "failed", shippingId))
          }
        >
          Envío fallido
        </Button>
      </ActionPanel>
    );
  }

  return null;
}

function ActionPanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper border border-line rounded-r3 p-4 mt-4">
      <p className="text-xs font-mono uppercase tracking-[0.08em] text-ink-3 mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
