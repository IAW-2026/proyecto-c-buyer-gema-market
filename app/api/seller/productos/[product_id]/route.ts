import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/app/mocks/seller/data";

/**
 * GET /api/seller/productos/:product_id
 * Devuelve el detalle completo de un producto.
 * Retorna 404 si el producto no existe.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ product_id: string }> },
) {
  const { product_id } = await params;

  const product = MOCK_PRODUCTS.find((p) => p.product_id === product_id);

  if (!product) {
    return NextResponse.json(
      { error: `Producto '${product_id}' no encontrado.` },
      { status: 404 },
    );
  }

  return NextResponse.json(product);
}
