import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_CATEGORIES } from "@/app/mocks/seller/data";

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

  // El detalle no expone `thumbnail_url`: trae el arreglo `images` completo.
  const {
    product_id: id,
    seller_id,
    title,
    description,
    price,
    currency,
    category_id,
    condition,
    stock,
    weight,
    height,
    width,
    depth,
    material,
    images,
    created_at,
  } = product as typeof product & { material?: string };

  const sellerData = MOCK_SELLERS[seller_id] ?? { shop_name: "Vendedor", logo_url: "" };
  const categoryData = MOCK_CATEGORIES.find((c) => c.category_id === category_id);

  return NextResponse.json({
    product_id: id,
    seller: {
      seller_id,
      shop_name: sellerData.shop_name,
      logo_url: sellerData.logo_url,
    },
    title,
    description,
    price,
    currency,
    category_id,
    category_name: categoryData?.name ?? null,
    condition,
    stock,
    weight,
    height,
    width,
    depth,
    ...(material !== undefined && { material }),
    images,
    created_at,
  });
}
