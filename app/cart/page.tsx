import { Suspense } from "react";
import { TopBar } from "@/app/components/ui";
import CartGrid from "@/app/components/features/cart/CartGrid";
import CartSkeleton from "@/app/components/features/cart/CartSkeleton";

export default function CartPage() {
  return (
    <div className="pb-[140px]">
      <TopBar back title="Tu carrito" />

      <Suspense fallback={<CartSkeleton />}>
        <CartGrid />
      </Suspense>
    </div>
  );
}
