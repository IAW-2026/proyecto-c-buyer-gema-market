"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductListItem } from "@/app/lib/types/product";
import { Icon } from "../ui/Icon";
import { fmtARS } from "@/app/lib/utils";

// ── Component ─────────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: ProductListItem;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  const [fav, setFav] = useState(false);
  const formattedPrice = fmtARS(product.price);

  return (
    <div className="group cursor-pointer rounded-r3 overflow-hidden bg-paper border border-line transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-sh-2">
      <Link href={`/product/${product.product_id}`} className="block">
        {/* ── Imagen ──────────────────────────────────────────────────────── */}
        <div className="relative aspect-square flex items-center justify-center bg-bone overflow-hidden">
          {product.thumbnail_url ? (
            /* Si hay imagen, la muestra */
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Placeholder cuando no hay imagen */
            <div className="flex h-full w-full items-center justify-center">
              <Icon name="box" size={48} className="text-ink-3/30" />
            </div>
          )}

          {/* Botón de favoritos (Corazón) */}
          <button
            onClick={(e) => {
              e.preventDefault(); // evita navegar al detalle
              e.stopPropagation();
              setFav(!fav);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-paper/90 backdrop-blur-[8px] flex items-center justify-center transition-colors z-10 ${
              fav ? "text-red-500" : "text-ink-2 hover:text-red-500"
            }`}
            aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Icon
              name="heart"
              size={16}
              className={fav ? "[fill:currentColor]" : ""}
            />
          </button>
        </div>

        {/* ── Info ────────────────────────────────────────────────────────── */}
        <div className={compact ? "px-3 pt-2.5 pb-3" : "px-4 pt-3.5 pb-4"}>
          <h3
            className={`${
              compact ? "text-[13px] h-[34px]" : "text-sm h-9"
            } font-medium leading-[1.3] mb-2 overflow-hidden text-ink group-hover:text-forest transition-colors`}
          >
            {product.title}
          </h3>

          <div className="flex justify-between items-baseline gap-2">
            <div
              className={`${
                compact ? "text-[15px]" : "text-[17px]"
              } font-semibold tracking-[-0.01em] text-ink`}
            >
              {formattedPrice}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
