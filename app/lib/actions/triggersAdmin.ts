"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/auth/permissions";
import { hashApiKey } from "@/app/lib/utils/hmac";

function apiHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key-hash": hashApiKey(process.env.INTERNAL_API_KEY ?? ""),
  };
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export async function triggerPaymentConfirmed(
  orderId: string,
  paymentId: string,
  totalAmount: number,
  currency: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const res = await fetch(
    `${baseUrl()}/api/buyer/pagos/${paymentId}/confirmado`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        payment_id: paymentId,
        orders: [
          {
            order_id: orderId,
            mp_payment_id: `sim-${Date.now()}`,
            status: "approved",
            amount: totalAmount,
            currency,
            paid_at: new Date().toISOString(),
          },
        ],
      }),
    },
  );

  if (!res.ok) return { ok: false, error: "Error al confirmar pago." };
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function triggerPaymentRejected(
  orderId: string,
  paymentId: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const res = await fetch(
    `${baseUrl()}/api/buyer/pagos/${paymentId}/rechazado`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        payment_id: paymentId,
        orders: [{ order_id: orderId, status: "rejected", reason: "Simulación admin" }],
      }),
    },
  );

  if (!res.ok) return { ok: false, error: "Error al rechazar pago." };
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function triggerShippingUpdate(
  orderId: string,
  shippingStatus: "picked_up" | "in_transit" | "delivered" | "failed",
  shippingId?: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const body = {
    shipping_id: shippingId ?? `sim-ship-${Date.now()}`,
    status: shippingStatus,
    tracking_code: `TRK-SIM-${Date.now()}`,
    updated_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(
      `${baseUrl()}/api/buyer/ordenes/${orderId}/estado-envio`,
      { method: "POST", headers: apiHeaders(), body: JSON.stringify(body) },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`[triggerShippingUpdate] HTTP ${res.status}:`, text);
      return { ok: false, error: `HTTP ${res.status}: ${text}` };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true };
  } catch (err) {
    console.error("[triggerShippingUpdate] fetch error:", err);
    return { ok: false, error: String(err) };
  }
}
