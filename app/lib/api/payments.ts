/**
 * Cliente HTTP de la Payments App (Layer 4 — External APIs).
 *
 * En desarrollo apunta a los route handlers locales de Next.js (/api/payments/*).
 * En producción se reemplaza con la variable de entorno PAYMENTS_API_URL.
 *
 * @see docs/apis.md — Payments App endpoints
 */

import type { PaymentOrderResult } from "@/app/lib/types/orders";
import type {
  PaymentOrderItem,
  CreatePaymentOrderParams,
} from "@/app/lib/types/api/payments";

export type { PaymentOrderItem, CreatePaymentOrderParams };

const PAYMENTS_BASE_URL =
  process.env.PAYMENTS_API_URL ??
  `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/payments`;

export async function createPaymentOrder(
  params: CreatePaymentOrderParams,
): Promise<PaymentOrderResult> {
  const res = await fetch(`${PAYMENTS_BASE_URL}/ordenes-de-pago`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      buyer_id: params.buyer_id,
      orders: params.orders,
      currency: params.currency ?? "ARS",
      return_url: params.return_url,
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Payments API error: ${res.status}`);
  return res.json();
}
