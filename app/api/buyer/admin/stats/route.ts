import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/auth/permissions";
import { getOrdenesStatsAdmin } from "@/app/lib/db/order";

/**
 * GET /api/buyer/admin/stats
 * Consumido por: Analytics Dashboard.
 * Requiere JWT de Clerk con role = "admin_buyer".
 *
 * @see docs/apis.md
 */
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get("date_from") ?? undefined;
  const dateTo = searchParams.get("date_to") ?? undefined;

  try {
    const stats = await getOrdenesStatsAdmin({
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[GET /api/buyer/admin/stats] Error:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 },
    );
  }
}
