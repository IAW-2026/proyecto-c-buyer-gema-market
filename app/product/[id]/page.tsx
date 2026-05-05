"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Icon,
  Pill,
  ProductGlyph,
  Card,
  Button,
  Avatar,
  Tabs,
} from "@/app/components/ui";
import { UH_PRODUCTS } from "@/app/lib/data";

const fmtARS = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const p = UH_PRODUCTS.find((x) => x.id === id) || UH_PRODUCTS[0];
  const [tab, setTab] = useState("descripcion");
  const [fav, setFav] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    // push("Agregado al carrito");
    alert("Agregado al carrito");
    setTimeout(() => router.push("/cart"), 800);
  };

  return (
    <div className="pb-24 lgx:pt-8 lgx:px-7 lgx:pb-14 lgx:bg-cream lgx:min-h-screen">
      <div className="flex flex-col lgx:grid lgx:grid-cols-[minmax(360px,500px)_minmax(0,1fr)] lgx:gap-8 lgx:items-start lgx:max-w-[1180px] lgx:mx-auto">
        {/* Image section */}
        <div className="relative lgx:static">
          <div
            className="aspect-square max-h-[520px] flex items-center justify-center relative min-[600px]:max-w-[560px] min-[600px]:mx-auto min-[600px]:rounded-r3 min-[600px]:overflow-hidden min-[600px]:border min-[600px]:border-line lgx:max-w-none lgx:rounded-r3 lgx:overflow-hidden lgx:border lgx:border-line lgx:sticky lgx:top-6 lgx:shadow-sh-1"
            style={{
              background: `linear-gradient(135deg, ${p.palette[0]}66, ${p.palette[1]}66)`,
            }}
          >
            <ProductGlyph kind={p.glyph} palette={p.palette} size={220} />
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-paper/95 flex items-center justify-center shadow-sh-1 active:scale-90 transition-transform"
              >
                <Icon name="arrowLeft" size={18} />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setFav(!fav)}
                  className={`w-10 h-10 rounded-full bg-paper/95 flex items-center justify-center shadow-sh-1 active:scale-90 transition-transform ${
                    fav ? "text-danger" : "text-ink"
                  }`}
                >
                  <Icon
                    name="heart"
                    size={18}
                    className={fav ? "[fill:currentColor]" : ""}
                  />
                </button>
              </div>
            </div>
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === 0 ? "w-6 bg-paper" : "w-1.5 bg-paper/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-4 py-5 min-[600px]:max-w-[680px] min-[600px]:mx-auto lgx:max-w-none lgx:p-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Pill tone="sage" size="sm">
              {p.condition}
            </Pill>
            <Pill tone="outline" size="sm" icon="pin">
              {p.location}
            </Pill>
          </div>
          <h1 className="text-2xl tracking-[-0.02em] font-semibold m-0 mb-2">
            {p.title}
          </h1>
          <div className="flex items-center gap-3 mb-4 text-[13px] text-ink-2">
            <span className="flex items-center gap-1">
              <Icon name="starFill" size={14} className="text-warn" />
              <strong>{p.rating}</strong>
              <span className="text-ink-3">({p.reviews})</span>
            </span>
            <span className="text-line-2">•</span>
            <span className="text-ink-3">{p.stock} disponibles</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[32px] font-bold tracking-[-0.02em]">
              {fmtARS(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-base text-ink-3 line-through">
                {fmtARS(p.oldPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-success mb-6">
            <Icon name="check" size={14} />
            <span>
              3 cuotas sin interés de {fmtARS(Math.round(p.price / 3))}
            </span>
          </div>

          <Card padding={16} className="mb-5 flex items-center gap-3">
            <Avatar name={p.seller} size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{p.seller}</div>
              <div className="text-xs text-ink-3 flex items-center gap-1">
                <Icon name="starFill" size={11} className="text-warn" /> 4.8 ·
                250 ventas
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push("/store/" + p.sellerId)}
            >
              Ver tienda
            </Button>
          </Card>

          <Card padding={14} className="mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bone flex items-center justify-center">
                <Icon name="truck" size={20} className="text-moss" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">
                  Envío a Bahía Blanca
                </div>
                <div className="text-xs text-ink-3">
                  Llega entre 26 y 28 de abril
                </div>
              </div>
              <span className="font-semibold text-sm">
                {fmtARS(p.shipping)}
              </span>
            </div>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line px-4 py-3 flex gap-2.5 z-50 max-w-[600px] mx-auto lgx:static lgx:max-w-none lgx:bg-transparent lgx:backdrop-blur-none lgx:border-t lgx:border-line lgx:px-0 lgx:pt-4 lgx:pb-0 lgx:mt-5">
            <div className="flex items-center border border-line-2 rounded-full h-12">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 h-full active:scale-90 transition-transform"
              >
                <Icon name="minus" size={16} />
              </button>
              <span className="min-w-6 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty(Math.min(p.stock, qty + 1))}
                className="px-3 h-full active:scale-90 transition-transform"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
            <Button size="lg" full variant="accent" onClick={handleAddToCart}>
              Agregar al carrito
            </Button>
          </div>

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

          <div className="py-5 text-sm text-ink-2 leading-[1.6]">
            {tab === "descripcion" && (
              <p>
                Pieza ideal para departamentos pequeños y luminosos. Tapizada en
                pana ecológica color verde oliva, con estructura de pino macizo
                y patas tornedas. Cómoda para dos personas. Vendida por
                estudiante que se vuelve a su ciudad — usado pero impecable.
              </p>
            )}
            {tab === "especificaciones" && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                <div>
                  <div className="text-ink-3">Dimensiones</div>
                  <div className="font-medium">{p.dims}</div>
                </div>
                <div>
                  <div className="text-ink-3">Material</div>
                  <div className="font-medium">Pino + pana</div>
                </div>
                <div>
                  <div className="text-ink-3">Color</div>
                  <div className="font-medium">Verde oliva</div>
                </div>
                <div>
                  <div className="text-ink-3">Peso</div>
                  <div className="font-medium">32 kg</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
