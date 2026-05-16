import { Suspense } from "react";
import { SectionTitle, EmptyState, Pagination } from "@/app/components/ui";
import { requireAdmin } from "@/app/lib/auth/roles";
import { getAllUsuarios, countUsuarios } from "@/app/lib/db/user";
import { UsuariosTable } from "./_components/UsuariosTable";
import { UsuariosTableSkeleton } from "./_components/UsuariosTableSkeleton";

const PAGE_SIZE = 7;

function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

async function UsuariosListContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const [usuarios, total] = await Promise.all([
    getAllUsuarios({ skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
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
          <Pagination
            basePath="/admin/usuarios"
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
          />
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
      <UsuariosTableSkeleton rows={PAGE_SIZE} />
    </>
  );
}
