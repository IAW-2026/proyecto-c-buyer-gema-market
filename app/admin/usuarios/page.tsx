import { Suspense } from "react";
import { SectionTitle, EmptyState, Pagination } from "@/app/components/ui";
import { requireAdmin } from "@/app/lib/auth/roles";
import { getAllUsuarios, countUsuarios } from "@/app/lib/db/user";
import { parsePage } from "@/app/lib/utils/pagination";
import { ADMIN_USERS_PAGE_SIZE } from "@/app/lib/constants/pagination";
import { UsuariosTable } from "./_components/UsuariosTable";
import { UsuariosTableSkeleton } from "./_components/UsuariosTableSkeleton";

async function UsuariosListContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const [usuarios, total] = await Promise.all([
    getAllUsuarios({ skip: (page - 1) * ADMIN_USERS_PAGE_SIZE, take: ADMIN_USERS_PAGE_SIZE }),
    countUsuarios(),
  ]);

  return (
    <>
      <SectionTitle eyebrow={`${total} usuarios`}>Usuarios</SectionTitle>

      {total === 0 ? (
        <EmptyState
          icon="user"
          title="Sin usuarios"
          body="Todavía no hay usuarios sincronizados desde Clerk."
        />
      ) : (
        <>
          <UsuariosTable usuarios={usuarios} />
          <div className="flex justify-center mt-6">
            <Pagination totalPages={Math.max(1, Math.ceil(total / ADMIN_USERS_PAGE_SIZE))} />
          </div>
        </>
      )}
    </>
  );
}

export default function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<UsuariosListSkeleton />}>
      <UsuariosListContent searchParams={searchParams} />
    </Suspense>
  );
}

function UsuariosListSkeleton() {
  return (
    <>
      <SectionTitle eyebrow="…">Usuarios</SectionTitle>
      <UsuariosTableSkeleton rows={ADMIN_USERS_PAGE_SIZE} />
    </>
  );
}
