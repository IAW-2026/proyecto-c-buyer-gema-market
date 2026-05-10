/**
 * Servicio de comunicación con la Shipping App.
 *
 * En desarrollo, los fetch apuntan a los route handlers locales de Next.js
 * (/api/shipping/*) que sirven datos mock.
 * En producción, se apunta a la URL real de la Shipping App mediante la
 * variable de entorno SHIPPING_API_URL.
 *
 * @see docs/apis.md — Shipping App endpoints
 */

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ShippingQuote {
  quote_id: string;
  price: number;
  currency: string;
  estimated_days: number;
  valid_until: string; // ISO string
}

export interface RequestQuoteParams {
  destination_address: {
    street: string;
    number: string;
    zip: string;
  };
  product_id: string;
  weight_kg: number;
  height_m: number;
  width_m: number;
  depth_m: number;
}

// ── Configuración ─────────────────────────────────────────────────────────────

/**
 * Base URL de la Shipping API.
 * - En desarrollo apunta a los route handlers locales de Next.js.
 * - En producción se reemplaza con la variable de entorno SHIPPING_API_URL.
 */
const SHIPPING_BASE_URL =
  process.env.SHIPPING_API_URL ??
  (process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/shipping`
    : "http://localhost:3000/api/shipping");

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * POST /api/shipping/cotizaciones
 * Solicita una cotización de envío para un producto hacia una dirección destino.
 *
 * @param params - Datos del envío (dirección destino, producto, dimensiones y peso)
 * @returns La cotización con price, estimated_days y quote_id para usar en el pago
 * @throws Error si la Shipping App falla o los parámetros son inválidos
 */
export async function requestShippingQuote(
  params: RequestQuoteParams,
): Promise<ShippingQuote> {
  const res = await fetch(`${SHIPPING_BASE_URL}/cotizaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    // No cachear cotizaciones: siempre son frescas
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shipping API error: ${res.status}`);
  }

  return res.json();
}
