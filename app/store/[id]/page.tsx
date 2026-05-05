"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  TopBar,
  Card,
  Avatar,
  Icon,
  Pill,
  EmptyState,
} from "@/app/components/ui";
import { ProductCard } from "@/app/components/products/ProductCard";
import {
  UH_PRODUCTS as allProducts,
  UH_CATEGORIES as categoryData,
} from "@/app/lib/data";

export default function StorePage() {
  const params = useParams();
  const id = params.id as string;

  const products = allProducts.filter((p) => p.sellerId === id);
  const fallback = allProducts.find((p) => p.sellerId === id) || allProducts[0];
  const sellerProducts = products.length
    ? products
    : allProducts.filter((p) => p.seller === fallback?.seller);

  const seller = sellerProducts[0]?.seller || "Tienda";
  const rating = sellerProducts.length
    ? (
        sellerProducts.reduce((sum, p) => sum + p.rating, 0) /
        sellerProducts.length
      ).toFixed(1)
    : "4.8";

  const reviews = sellerProducts.reduce((sum, p) => sum + (p.reviews || 0), 0);
  const categories = [...new Set(sellerProducts.map((p) => p.category))];
  const categoryNames = categories.map(
    (cat) => categoryData.find((c) => c.id === cat)?.name || cat,
  );

  return (
    <div className="min-h-screen bg-cream pb-10 lgx:px-7 lgx:pt-8 lgx:pb-14">
      <div className="lgx:hidden">
        <TopBar back title="Tienda" />
      </div>
      <div className="p-4 min-[600px]:max-w-[820px] min-[600px]:mx-auto min-[600px]:p-6 lgx:max-w-[1180px] lgx:mx-auto lgx:p-0">
        <Card
          padding={0}
          className="overflow-hidden mb-[18px] animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="h-[150px] relative bg-gradient-to-br from-clay to-bark min-[600px]:h-[190px] lgx:h-[220px]">
            <div className="absolute right-[18px] bottom-[18px] flex gap-2 flex-wrap justify-end max-[480px]:hidden">
              <Pill tone="sand" icon="pin">
                {fallback?.location || "Bahía Blanca"}
              </Pill>
              <Pill tone="sage">Vendedor verificado</Pill>
            </div>
          </div>
          <div className="px-[18px] pb-5 lgx:px-6 lgx:pb-6">
            <div className="flex gap-4 items-start -mt-[42px] mb-4">
              <div className="p-1 rounded-full bg-paper shadow-sh-1">
                <Avatar name={seller} size={76} />
              </div>
              <div className="min-w-0 pt-[46px]">
                <h1 className="m-0 text-[26px] font-bold">{seller}</h1>
                <div className="flex gap-2 items-center flex-wrap text-ink-3 text-[13px] mt-1">
                  <span className="inline-flex items-center gap-1 text-ink-2">
                    <Icon name="starFill" size={13} className="text-warn" />
                    {rating}
                  </span>
                  <span>·</span>
                  <span>{reviews || 250} reseñas</span>
                  <span>·</span>
                  <span>{sellerProducts.length} productos</span>
                </div>
              </div>
            </div>
            <p className="m-0 mb-4 text-ink-2 leading-[1.5] max-w-[720px]">
              Productos seleccionados para departamentos en Bahía Blanca, con
              envío coordinado por UniHousing y atención directa del vendedor.
            </p>
            <div className="grid grid-cols-3 gap-2.5 max-[480px]:grid-cols-1">
              <div className="bg-bone rounded-r2 p-3">
                <div className="text-[11px] text-ink-3">Productos</div>
                <div className="text-xl font-bold">{sellerProducts.length}</div>
              </div>
              <div className="bg-bone rounded-r2 p-3">
                <div className="text-[11px] text-ink-3">Rating</div>
                <div className="text-xl font-bold">{rating}</div>
              </div>
              <div className="bg-bone rounded-r2 p-3">
                <div className="text-[11px] text-ink-3">Categorías</div>
                <div className="text-xl font-bold">
                  {categories.length || 1}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between gap-3 mb-3 animate-in fade-in duration-700">
          <div>
            <div className="text-[11px] font-mono uppercase text-ink-3 mb-1">
              Publicaciones
            </div>
            <h2 className="m-0 text-[22px] font-bold">
              Productos de la tienda
            </h2>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end max-[480px]:hidden">
            {categoryNames.slice(0, 3).map((name) => (
              <Pill key={name}>{name}</Pill>
            ))}
          </div>
        </div>

        {sellerProducts.length === 0 ? (
          <EmptyState
            icon="box"
            title="Sin productos"
            body="Esta tienda no tiene publicaciones activas."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 min-[600px]:grid-cols-3 min-[600px]:gap-3.5 lgx:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lgx:gap-[18px] animate-in fade-in duration-1000">
            {sellerProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
