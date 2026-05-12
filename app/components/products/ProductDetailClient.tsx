"use client";

import React from "react";
import { Toast } from "@/app/components/ui";
import type { ProductDetail } from "@/app/lib/types/product";
import { useCart } from "@/app/components/products/hooks/useCart";

// Componentes modulares
import ProductImageGallery from "./detail/ProductImageGallery";
import ProductInfo from "./detail/ProductInfo";
import ProductCartActions from "./detail/ProductCartActions";
import ProductTabsSection from "./detail/ProductTabsSection";

interface ProductDetailClientProps {
  p: ProductDetail;
  initialFavorite?: boolean;
}

export default function ProductDetailClient({
  p,
  initialFavorite = false,
}: ProductDetailClientProps) {
  const { isPending, notification, handleAddToCart } = useCart(
    p.product_id,
  );

  return (
    <div className="pb-24 lgx:pt-8 lgx:px-7 lgx:pb-14 lgx:bg-cream lgx:min-h-screen">
      <div className="flex flex-col lgx:grid lgx:grid-cols-[minmax(360px,500px)_minmax(0,1fr)] lgx:gap-8 lgx:items-start lgx:max-w-[1180px] lgx:mx-auto">
        {/* Sección de Imagen y Galería */}
        <ProductImageGallery
          thumbnailUrl={p.thumbnail_url}
          title={p.title}
          productId={p.product_id}
          initialFavorite={initialFavorite}
        />

        {/* Sección de Información y Compra */}
        <div className="px-4 py-5 min-[600px]:max-w-[680px] min-[600px]:mx-auto lgx:max-w-none lgx:p-0 w-full min-w-0">
          <ProductInfo
            title={p.title}
            price={p.price}
            stock={p.stock}
            status={p.status}
          />

          <ProductCartActions
            stock={p.stock}
            isPending={isPending}
            onAddToCart={handleAddToCart}
          />

          <ProductTabsSection
            description={p.description}
            width={p.width}
            height={p.height}
            depth={p.depth}
            weight={p.weight}
          />
        </div>
      </div>

      {/* Notificación Global (Toast) */}
      <Toast
        show={!!notification}
        type={notification?.type || "success"}
        message={notification?.message || ""}
        action={
          notification?.type === "success"
            ? { label: "Ver carrito", href: "/cart" }
            : { label: "Reintentar", href: "/cart" }
        }
      />
    </div>
  );
}
