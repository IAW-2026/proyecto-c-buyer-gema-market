import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/app/lib/auth/adminGate";
import { countUniqueBuyersAdmin } from "@/app/lib/db/order";

/**
 * GET /api/buyer/admin/usuarios-activos
 * Consumido por: Analytics Dashboard.
 * Requiere JWT de Clerk con role = "admin_buyer" o header x-api-key-hash.
 *
 * @see docs/apis.md
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get("date_from") ?? undefined;
  const dateTo = searchParams.get("date_to") ?? undefined;

  const isoDatetime = z.string().datetime();
  if (dateFrom && !isoDatetime.safeParse(dateFrom).success) {
    return NextResponse.json(
      { error: "date_from debe ser ISO 8601 completo con hora (ej: 2026-06-16T00:00:00.000Z)" },
      { status: 400 },
    );
  }
  if (dateTo && !isoDatetime.safeParse(dateTo).success) {
    return NextResponse.json(
      { error: "date_to debe ser ISO 8601 completo con hora (ej: 2026-06-16T23:59:59.999Z)" },
      { status: 400 },
    );
  }

  try {
    const count = await countUniqueBuyersAdmin({
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("[GET /api/buyer/admin/usuarios-activos] Error:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios activos" },
      { status: 500 },
    );
  }
}
