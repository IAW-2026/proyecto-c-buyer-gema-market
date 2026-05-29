import { Suspense } from "react";
import { CheckoutFetcher } from "./_components/CheckoutFetcher";
import CheckoutSkeleton from "./_components/CheckoutSkeleton";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutFetcher />
    </Suspense>
  );
}
