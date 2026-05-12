/**
 * Cliente HTTP de la Shipping App (Layer 4 — External APIs).
 *
 * En desarrollo apunta a los route handlers locales de Next.js (/api/shipping/*).
 * En producción se reemplaza con la variable de entorno SHIPPING_API_URL.
 *
 * @see docs/apis.md — Shipping App endpoints
 */

import type { ShippingQuote } from "@/app/lib/types/orders";
import type { RequestQuoteParams } from "@/app/lib/types/api/shipping";

export type { RequestQuoteParams };

if (!process.env.SHIPPING_API_URL)
  throw new Error("Missing required environment variable: SHIPPING_API_URL");

const SHIPPING_BASE_URL = process.env.SHIPPING_API_URL;

export async function requestShippingQuote(
  params: RequestQuoteParams,
): Promise<ShippingQuote> {
  const res = await fetch(`${SHIPPING_BASE_URL}/cotizaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Shipping API error: ${res.status}`);
  return res.json();
}
