import { Suspense } from "react";
import { AccountFetcher } from "./_components/AccountFetcher";
import AccountSkeleton from "./_components/AccountSkeleton";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-cream pb-47 lgx:pt-8 lgx:px-7 lgx:pb-32">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountFetcher />
      </Suspense>
    </div>
  );
}
