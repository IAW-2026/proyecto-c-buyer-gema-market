"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon, Pill, Card, Button, Tabs } from "@/app/components/ui";
import type { ProductDetail } from "@/app/lib/types/product";
import { fmtARS } from "@/app/lib/utils/format";
import FavoriteButton from "../features/favorites/FavoriteButton";
import { addToCartAction } from "@/app/lib/actions/cart";

export default function ProductDetailClient({
  p,
  initialFavorite = false,
}: {
  p: ProductDetail;
  initialFavorite?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tab, setTab] = useState("descripcion");
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCartAction(p.product_id, quantity);

      if (result.success) {
        setNotification({
          type: "success",
          message: `¡Agregado al carrito! (${quantity} ${
            quantity === 1 ? "unidad" : "unidades"
          })`,
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({
          type: "error",
          message: result.error || "No se pudo agregar al carrito",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    });
  };

  // const sellerName = `Vendedor ${p.seller_id.slice(-4)}`; // Simulated seller name
  const condition = p.status === "new" ? "Nuevo" : "Usado";
  const location = "Bahía Blanca"; // Simulated location

  // TODO, pedir cotizacion de envios
  const shipping = 5000; // Simulated shipping

  return (
    <div className="pb-24 lgx:pt-8 lgx:px-7 lgx:pb-14 lgx:bg-cream lgx:min-h-screen">
      <div className="flex flex-col lgx:grid lgx:grid-cols-[minmax(360px,500px)_minmax(0,1fr)] lgx:gap-8 lgx:items-start lgx:max-w-[1180px] lgx:mx-auto">
        {/* Image section */}
        <div className="relative lgx:static">
          <div className="aspect-square max-h-[520px] flex items-center justify-center relative min-[600px]:max-w-[560px] min-[600px]:mx-auto min-[600px]:rounded-r3 min-[600px]:overflow-hidden min-[600px]:border min-[600px]:border-line lgx:max-w-none lgx:rounded-r3 lgx:overflow-hidden lgx:border lgx:border-line lgx:sticky lgx:top-6 lgx:shadow-sh-1 bg-bone">
            {p.thumbnail_url ? (
              <Image
                src={p.thumbnail_url}
                alt={p.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <Icon name="box" size={64} className="text-ink-3/30" />
            )}

            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <button
                onClick={() => router.back()}
                aria-label="Volver"
                className="w-10 h-10 rounded-full bg-paper/95 flex items-center justify-center shadow-sh-1 active:scale-90 transition-transform"
              >
                <Icon name="arrowLeft" size={18} />
              </button>
              <div className="flex gap-2">
                <FavoriteButton
                  productId={p.product_id}
                  initialFavorite={initialFavorite}
                  className="w-10 h-10 rounded-full bg-paper/95 shadow-sh-1 active:scale-90"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-4 py-5 min-[600px]:max-w-[680px] min-[600px]:mx-auto lgx:max-w-none lgx:p-0 w-full min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Pill tone="sage" size="sm">
              {condition}
            </Pill>
            <Pill tone="outline" size="sm" icon="pin">
              {location}
            </Pill>
          </div>
          <h1 className="text-2xl tracking-[-0.02em] font-semibold m-0 mb-2">
            {p.title}
          </h1>
          <div className="flex items-center gap-3 mb-4 text-[13px] text-ink-2">
            <span className="text-ink-3">{p.stock} disponibles</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[32px] font-bold tracking-[-0.02em]">
              {fmtARS(p.price)}
            </span>
          </div>

          {/* boton para ir a la tienda del vendedor 
           <Card padding={16} className="mb-5 flex items-center gap-3">
            <Avatar name={sellerName} size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{sellerName}</div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push("/store/" + p.seller_id)}
            >
              Ver tienda
            </Button>
          </Card> */}

          {/* Card de envío */}
          <Card padding={14} className="mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bone flex items-center justify-center">
                <Icon name="truck" size={20} className="text-moss" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">
                  Envío a {location}
                </div>
                <div className="text-xs text-ink-3">Llega pronto</div>
              </div>
              <span className="font-semibold text-sm">
                {shipping > 0 ? fmtARS(shipping) : "Gratis"}
              </span>
            </div>
          </Card>

          {/* Botón para agregar al carrito */}
          <div className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line px-4 py-3 flex gap-2.5 z-50 max-w-[600px] mx-auto lgx:static lgx:max-w-none lgx:bg-transparent lgx:backdrop-blur-none lgx:border-t lgx:border-line lgx:px-0 lgx:pt-4 lgx:pb-0 lgx:mt-5">
            <div className="flex items-center border border-line-2 rounded-full h-12 bg-paper shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                disabled={quantity <= 1 || isPending}
                className="px-4 h-full active:scale-90 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="minus" size={16} />
              </button>
              <span className="min-w-[40px] text-center font-bold text-lg select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(p.stock || 99, q + 1))
                }
                aria-label="Aumentar cantidad"
                disabled={quantity >= (p.stock || 99) || isPending}
                className="px-4 h-full active:scale-90 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
            <Button
              size="lg"
              full
              variant="accent"
              onClick={handleAddToCart}
              loading={isPending}
              disabled={isPending}
            >
              Agregar al carrito
            </Button>
          </div>

          {/** Tabs de descripción y especificaciones */}
          <div className="mt-8">
            <Tabs
              tabs={[
                { id: "descripcion", label: "Descripción" },
                { id: "especificaciones", label: "Especificaciones" },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>

          <div
            className="py-5 text-sm text-ink-2 leading-[1.6] min-h-[200px] w-full"
            role="tabpanel"
            id={`tab-panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "descripcion" && (
              <p className="w-full">
                {p.description || "Sin descripción disponible."}
              </p>
            )}
            {tab === "especificaciones" && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] w-full">
                <div>
                  <div className="text-ink-3">Dimensiones</div>
                  <div className="font-medium">
                    {p.width}x{p.height}x{p.depth}m
                  </div>
                </div>
                <div>
                  <div className="text-ink-3">Peso</div>
                  <div className="font-medium">{p.weight} kg</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notificación (Toast) */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out transform ${
          notification
            ? "translate-y-0 opacity-100"
            : "-translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        {/* Usamos un contenedor interno que solo cambia si hay una notificación activa 
            para evitar el "flash" de color al cerrar */}
        {notification && (
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-sh-2 border backdrop-blur-md transition-colors ${
              notification.type === "success"
                ? "bg-moss/90 border-moss/20 text-paper"
                : "bg-red-600/90 border-red-500/20 text-paper"
            }`}
          >
            <Icon
              name={notification.type === "success" ? "check" : "alertCircle"}
              size={20}
            />
            <span className="font-medium text-sm tracking-tight">
              {notification.message}
            </span>
            {notification.type === "success" && (
              <Button
                size="sm"
                variant="secondary"
                className="ml-2 bg-paper/20 hover:bg-paper/30 border-transparent text-paper h-8 px-3"
                onClick={() => router.push("/cart")}
              >
                Ver carrito
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
