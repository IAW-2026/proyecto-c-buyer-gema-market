import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OrdenStatus } from "@prisma/client";
import { isAdminRequest } from "@/app/lib/auth/adminGate";
import { getOrdenById, updateOrden } from "@/app/lib/db/order";

// Estados terminales desde los que no se puede cancelar
const TERMINAL_STATUSES: OrdenStatus[] = ["delivered", "shipping_failed", "cancelled"];

const PatchSchema = z.object({
  status: z.enum(["cancelled"]),
});

/**
 * GET /api/buyer/admin/ordenes/:order_id
 * Consumido por: Control Plane.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> },
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { order_id } = await params;

  try {
    const orden = await getOrdenById(order_id);
    if (!orden) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      order_id: orden.id,
      buyer_id: orden.buyerId,
      seller_id: orden.sellerId,
      product_id: orden.productId,
      quantity: orden.quantity,
      unit_price: Number(orden.unitPrice),
      quote_id: orden.quoteId ?? null,
      shipping_price: orden.shippingPrice,
      total_amount: Number(orden.totalAmount),
      currency: orden.currency,
      status: orden.status,
      payment_id: orden.paymentId ?? null,
      shipping_id: orden.shippingId ?? null,
      created_at: orden.createdAt,
      updated_at: orden.updatedAt,
    });
  } catch (error) {
    console.error("[GET /api/buyer/admin/ordenes/:order_id] Error:", error);
    return NextResponse.json({ error: "Error al obtener la orden" }, { status: 500 });
  }
}

/**
 * PATCH /api/buyer/admin/ordenes/:order_id
 * Consumido por: Control Plane.
 * Solo permite cancelar desde estados no terminales.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> },
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { order_id } = await params;

  const parsed = PatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Cuerpo inválido", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const orden = await getOrdenById(order_id);
    if (!orden) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (TERMINAL_STATUSES.includes(orden.status)) {
      return NextResponse.json(
        { error: `No se puede cancelar una orden en estado '${orden.status}'` },
        { status: 422 },
      );
    }

    const updated = await updateOrden(order_id, { status: "cancelled" });

    return NextResponse.json({ order_id: updated.id, status: updated.status });
  } catch (error) {
    console.error("[PATCH /api/buyer/admin/ordenes/:order_id] Error:", error);
    return NextResponse.json({ error: "Error al actualizar la orden" }, { status: 500 });
  }
}
