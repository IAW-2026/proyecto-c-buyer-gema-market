import { Suspense } from "react";
import { SectionTitle } from "@/app/components/ui";
import { ADMIN_USERS_PAGE_SIZE } from "@/app/lib/constants/pagination";
import { UsuariosListContent } from "./_components/UsersListContent";
import { UsuariosTableSkeleton } from "./_components/UsersTableSkeleton";

type SearchParams = Promise<{ page?: string | string[]; search?: string | string[] }>;

function UsersListSkeleton() {
  return (
    <>
      <SectionTitle eyebrow="…">Usuarios</SectionTitle>
      <UsuariosTableSkeleton rows={ADMIN_USERS_PAGE_SIZE} />
    </>
  );
}

export default function AdminUsuariosPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<UsersListSkeleton />}>
      <UsuariosListContent searchParams={searchParams} />
    </Suspense>
  );
}
