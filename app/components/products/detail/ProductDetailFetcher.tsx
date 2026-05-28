import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/app/lib/api/seller";
import { isFavorited } from "@/app/lib/db/favorite";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkIdToUserId";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import ProductCartActions from "./ProductCartActions";
import ProductTabsSection from "./ProductTabsSection";

interface ProductDetailFetcherProps {
  params: Promise<{ id: string }>;
}

export async function ProductDetailFetcher({
  params,
}: ProductDetailFetcherProps) {
  const { id } = await params;

  const [product, initialFavorite] = await Promise.all([
    getProductById(id),
    getCurrentUserId().then((userId) =>
      userId ? isFavorited(userId, id) : false,
    ),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col lgx:grid lgx:grid-cols-[minmax(360px,500px)_minmax(0,1fr)] lgx:gap-8 lgx:items-start lgx:max-w-[1180px] lgx:mx-auto">
      <ProductImageGallery
        images={product.images}
        title={product.title}
        productId={product.product_id}
        initialFavorite={initialFavorite}
      />

      <div className="px-4 py-5 min-[600px]:max-w-[680px] min-[600px]:mx-auto lgx:max-w-none lgx:p-0 w-full min-w-0">
        <ProductInfo
          title={product.title}
          price={product.price}
          stock={product.stock}
          condition={product.condition}
          category_name={product.category_name}
        />

        <ProductCartActions
          productId={product.product_id}
          stock={product.stock}
        />

        <Link
          href={`/shop/${product.seller.seller_id}`}
          className="flex items-center gap-2 mt-4 text-sm text-ink-2 hover:text-ink-1 transition-colors"
        >
          {product.seller.logo_url && (
            <Image
              src={product.seller.logo_url}
              alt={product.seller.shop_name}
              width={28}
              height={28}
              className="rounded-full object-cover shrink-0"
            />
          )}
          <span className="font-medium">{product.seller.shop_name}</span>
          <span className="text-ink-3">→ Ver tienda</span>
        </Link>

        <ProductTabsSection
          description={product.description}
          width={product.width}
          height={product.height}
          depth={product.depth}
          weight={product.weight}
          material={product.material}
        />
      </div>
    </div>
  );
}
