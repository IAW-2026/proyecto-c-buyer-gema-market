/**
 * Servicio de comunicación con la Payments App.
 *
 * En desarrollo, los fetch apuntan a los route handlers locales de Next.js
 * (/api/payments/*) que sirven datos mock (sin Mercado Pago real).
 * En producción, se apunta a la URL real de la Payments App mediante la
 * variable de entorno PAYMENTS_API_URL.
 *
 * @see docs/apis.md — Payments App endpoints
 */

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface PaymentOrderItem {
  order_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  quote?: {
    quote_id: string;
    shipping_price: number;
  };
}

export interface CreatePaymentOrderParams {
  buyer_id: string;
  orders: PaymentOrderItem[];
  currency?: string;
  return_url: string;
}

export interface PaymentOrderResult {
  payment_id: string;
  checkout_url: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

// ── Configuración ─────────────────────────────────────────────────────────────

/**
 * Base URL de la Payments API.
 * - En desarrollo apunta a los route handlers locales de Next.js.
 * - En producción se reemplaza con la variable de entorno PAYMENTS_API_URL.
 */
const PAYMENTS_BASE_URL =
  process.env.PAYMENTS_API_URL ??
  (process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`
    : "http://localhost:3000/api/payments");

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * POST /api/payments/ordenes-de-pago
 * Crea una intención de pago agrupando múltiples órdenes.
 * Retorna la checkout_url a la que se redirige al comprador para pagar.
 *
 * @param params - Datos del comprador, órdenes a pagar y URL de retorno
 * @returns payment_id, checkout_url (URL de Mercado Pago o mock) y status inicial
 * @throws Error si la Payments App falla o los parámetros son inválidos
 */
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
    // No cachear: cada orden de pago es única
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Payments API error: ${res.status}`);
  }

  return res.json();
}
