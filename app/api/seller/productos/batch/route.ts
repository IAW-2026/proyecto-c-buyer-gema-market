import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS, MOCK_SELLERS } from "@/app/mocks/seller/data";

/**
 * POST /api/seller/productos/batch
 * Devuelve la información de detalle de un lote de productos a partir de sus IDs.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_ids } = body;

    if (
      !product_ids ||
      !Array.isArray(product_ids) ||
      product_ids.length === 0
    ) {
      return NextResponse.json(
        { error: "product_ids is required and must be a non-empty array" },
        { status: 400 },
      );
    }

    const products = MOCK_PRODUCTS.filter((p) =>
      product_ids.includes(p.product_id),
    ).map((p) => {
      const sellerData = MOCK_SELLERS[p.seller_id] ?? {
        shop_name: "Vendedor",
        logo_url: "",
      };
      return {
        product_id: p.product_id,
        seller: {
          seller_id: p.seller_id,
          shop_name: sellerData.shop_name,
          logo_url: sellerData.logo_url,
        },
        title: p.title,
        category_id: p.category_id,
        price: p.price,
        currency: p.currency,
        stock: p.stock,
        condition: p.condition as "nuevo" | "usado",
        thumbnail_url: p.thumbnail_url,
        weight: p.weight,
        height: p.height,
        width: p.width,
        depth: p.depth,
      };
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
