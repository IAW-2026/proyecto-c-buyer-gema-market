/**
 * Tipos de la Shipping App según la documentación.
 * @see docs/apis.md — POST /api/shipping/cotizaciones
 *
 * Convención: todos los campos en snake_case (per docs/apis.md).
 */

import type { Address } from "@/app/lib/types/user";

// ── Request: POST /api/shipping/cotizaciones ──────────────────────────────────
export interface RequestQuoteParams {
  destination_address: Address;
  product_id: string;
  weight_kg: number;
  height_cm: number;
  width_cm: number;
  depth_cm: number;
}

// ── Response: POST /api/shipping/cotizaciones ─────────────────────────────────
/**
 * Cotización de envío retornada por la Shipping App.
 * `valid_until` es ISO 8601; tras esa fecha el quote_id deja de ser válido.
 */
export interface ShippingQuote {
  quote_id: string;
  price: number;
  currency: string;
  estimated_days: number;
  valid_until: string;
}

// ── Response: GET /api/shipping/envios/:order_id ──────────────────────────────
export interface ShipmentDetail {
  shipping_id: string;
  order_id: string;
  status: string;
  tracking_code: string;
  tracking_url: string;
  pickup_address: { street: string; number: string; zip: string };
  delivery_address: { street: string; number: string; floor?: string; zip: string };
  price: number;
  picked_up_at: string;
  delivered_at: string | null;
}
