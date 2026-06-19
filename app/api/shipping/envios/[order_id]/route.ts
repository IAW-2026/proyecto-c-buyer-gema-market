import { NextRequest, NextResponse } from "next/server";
import { createMockEnvio } from "@/app/mocks/shipping/data";
import { validateApiKey } from "@/app/lib/utils/hmac";

/**
 * GET /api/shipping/envios/:order_id
 * Simula la consulta de estado de un envío en la Shipping App.
 *
 * @see docs/apis.md — GET /api/shipping/envios/:order_id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> },
) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { order_id } = await params;
  const envio = createMockEnvio(order_id);

  return NextResponse.json(envio);
}
