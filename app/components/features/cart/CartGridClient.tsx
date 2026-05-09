"use client";

import { Button, EmptyState } from "@/app/components/ui";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CartItemWithProduct } from "@/app/lib/helpers/cart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

interface CartGridClientProps {
  initialItems: CartItemWithProduct[];
}

export default function CartGridClient({ initialItems }: CartGridClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  // Cálculos derivados del estado
  const { subtotal, ship, total } = useMemo(() => {
    const sub = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shp = items.length > 0 ? 7300 : 0;
    return {
      subtotal: sub,
      ship: shp,
      total: sub + shp,
    };
  }, [items]);

  // Handlers
  const updateQuantity = (id: string, delta: number) =>
    setItems((current) =>
      current.map((i) =>
        i.product_id === id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i,
      ),
    );

  const remove = (id: string) => {
    setItems((current) => current.filter((i) => i.product_id !== id));
  };

  if (items.length === 0) {
    return (
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
    );
  }

  return (
    <div>
      <div className="p-4 flex flex-col gap-3">
        {items.map((item) => (
          <CartItem
            key={item.product_id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={remove}
          />
        ))}
      </div>

      <CartSummary
        subtotal={subtotal}
        ship={ship}
        total={total}
        onCheckout={() => router.push("/checkout")}
      />
    </div>
  );
}
