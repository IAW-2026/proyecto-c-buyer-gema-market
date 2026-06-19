import { Suspense } from "react";
import { SectionTitle } from "@/app/components/ui";
import { UsuarioDetailContent } from "../_components/UserDetailContent";
import { UsuarioFormSkeleton } from "../_components/UserFormSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

function UserDetailSkeleton() {
  return (
    <>
      <SectionTitle eyebrow="Usuario">Cargando…</SectionTitle>
      <UsuarioFormSkeleton />
    </>
  );
}

export default function AdminUsuarioDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UsuarioDetailContent params={params} />
    </Suspense>
  );
}
