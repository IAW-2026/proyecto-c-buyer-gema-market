import { NextRequest, NextResponse } from "next/server";
import { createMockQuote } from "@/app/mocks/shipping/data";
import { validateApiKey } from "@/app/lib/utils/hmac";

/**
 * POST /api/shipping/cotizaciones
 * Simula la cotización de envío de la Shipping App.
 *
 * @see docs/apis.md — POST /api/shipping/cotizaciones
 *
 * Body esperado:
 * {
 *   destination_address: { street, number, zip },
 *   product_id: string,
 *   weight_kg: number,
 *   height_cm: number,
 *   width_cm: number,
 *   depth_cm: number
 * }
 *
 * Response 200:
 * {
 *   quote_id, price, currency, estimated_days, valid_until
 * }
 */
export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { destination_address, product_id, weight_kg, height_cm, width_cm, depth_cm } = body;

    if (destination_address?.zip !== "8000") {
      return NextResponse.json(
        { error: "La dirección de destino está fuera del área de cobertura (Bahía Blanca)." },
        { status: 400 },
      );
    }

    if (!product_id) {
      return NextResponse.json(
        { error: "product_id es requerido" },
        { status: 400 },
      );
    }

    // Usar peso del body; si no viene, default 5 kg
    const weight = typeof weight_kg === "number" ? weight_kg : 5;
    // Convertir cm → m para calcShippingPrice (trabaja en metros)
    const height = typeof height_cm === "number" ? height_cm / 100 : 0.5;
    const width = typeof width_cm === "number" ? width_cm / 100 : 0.5;
    const depth = typeof depth_cm === "number" ? depth_cm / 100 : 0.5;

    const quote = createMockQuote(product_id, weight, height, width, depth);

    return NextResponse.json(quote, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al calcular cotización" },
      { status: 500 },
    );
  }
}
