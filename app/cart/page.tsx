"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
  Card,
  Icon,
  ProductGlyph,
  Button,
  EmptyState,
} from "@/app/components/ui";
import { UH_PRODUCTS } from "@/app/mocks/buyer/data";
// import { getProductsBatch } from "@/app/lib/services/seller";
import { fmtARS } from "@/app/lib/utils/format";

export default function CartPage() {
  const router = useRouter();

  // TODO: Obtener ID del usuario.
  // Consultar en la base de datos y obtener los productos en el carrito
  // del usuario.

  // getProductsInCart va a estar en lib/db/cart.ts
  // const cart_items_id = getProductsInCart();

  // TODO: Usar getProductsBatch con los productos del carrito
  //const cartItems = await getProductsBatch(cart_items_id);

  // Initial state with mock items
  const [items, setItems] = useState([
    { ...UH_PRODUCTS[0], qty: 1 },
    { ...UH_PRODUCTS[3], qty: 2 },
  ]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = 7300;
  const total = subtotal + ship;

  const updateQty = (id: string, d: number) =>
    setItems(
      items.map((i) =>
        i.product_id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i,
      ),
    );

  const remove = (id: string) => setItems(items.filter((i) => i.product_id !== id));

  return (
    <div className={items.length ? "pb-[240px]" : "pb-[140px]"}>
      <TopBar back title="Tu carrito" />
      {items.length === 0 ? (
        <EmptyState
          icon="cart"
          title="Carrito vacío"
          body="Agregá productos para empezar tu mudanza."
          action={
            <Button variant="accent" onClick={() => router.push("/")}>
              Explorar
            </Button>
          }
        />
      ) : (
        <>
          <div className="p-4 flex flex-col gap-3">
            {items.map((i) => (
              <Card key={i.product_id} padding={14}>
                <div className="flex gap-3.5">
                  <div
                    className="w-[84px] h-[84px] rounded-r2 flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${i.palette[0]}33, ${i.palette[1]}33)`,
                    }}
                  >
                    <ProductGlyph
                      kind={i.glyph}
                      palette={i.palette}
                      size={48}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-ink-3 font-mono">
                      {i.seller}
                    </div>
                    <div className="text-sm font-medium mb-2">{i.title}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-line-2 rounded-full h-8">
                        <button
                          onClick={() => updateQty(i.product_id, -1)}
                          className="px-2.5 h-full active:scale-90 transition-transform"
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span className="min-w-5 text-center text-[13px] font-semibold">
                          {i.qty}
                        </span>
                        <button
                          onClick={() => updateQty(i.product_id, 1)}
                          className="px-2.5 h-full active:scale-90 transition-transform"
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <div className="text-base font-semibold">
                        {fmtARS(i.price * i.qty)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => remove(i.product_id)}
                    className="text-xs text-danger flex items-center gap-1 hover:underline"
                  >
                    <Icon name="trash" size={12} /> Quitar
                  </button>
                </div>
              </Card>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line px-4 py-3 z-50 lgx:left-[240px]">
            <div className="w-full max-w-[760px] mx-auto">
              <div className="grid gap-1.5 text-[13px] mb-3">
                <div className="flex justify-between">
                  <span className="text-ink-3">Subtotal</span>
                  <span>{fmtARS(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">Envío</span>
                  <span>{fmtARS(ship)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-1.5 border-t border-line">
                  <span>Total</span>
                  <span>{fmtARS(total)}</span>
                </div>
              </div>
              <Button
                full
                size="lg"
                variant="accent"
                iconRight="arrowRight"
                onClick={() => router.push("/checkout")}
              >
                Continuar al checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
