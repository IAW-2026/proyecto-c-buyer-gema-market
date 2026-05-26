import { Suspense } from "react";
import { AdminDashboardContent } from "./_components/AdminDashboardContent";
import { AdminDashboardSkeleton } from "./_components/AdminDashboardSkeleton";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
