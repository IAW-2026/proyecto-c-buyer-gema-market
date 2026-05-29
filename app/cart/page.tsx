import { Suspense } from "react";
import { TopBar } from "@/app/components/ui";
import { CartFetcher } from "./_components/CartFetcher";
import CartSkeleton from "./_components/CartSkeleton";

export default function CartPage() {
  return (
    <div className="pb-[140px]">
      <TopBar back title="Tu carrito" />
      <Suspense fallback={<CartSkeleton />}>
        <CartFetcher />
      </Suspense>
    </div>
  );
}
