import { SectionTitle, EmptyState, Pagination } from "@/app/components/ui";
import { requireAdmin } from "@/app/lib/auth/permissions";
import { getAllUsuarios, countUsuarios } from "@/app/lib/db/user";
import { parsePage } from "@/app/lib/utils/pagination";
import { ADMIN_USERS_PAGE_SIZE } from "@/app/lib/constants/pagination";
import { SearchBar } from "@/app/admin/_components/SearchBar";
import { UsuariosTable } from "./UsersTable";

type SearchParams = Promise<{ page?: string | string[]; search?: string | string[] }>;

export async function UsuariosListContent({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = parsePage(pageParam);
  const search = Array.isArray(searchParam) ? searchParam[0] : searchParam;

  const [usuarios, total] = await Promise.all([
    getAllUsuarios({ skip: (page - 1) * ADMIN_USERS_PAGE_SIZE, take: ADMIN_USERS_PAGE_SIZE, search }),
    countUsuarios(search),
  ]);

  return (
    <>
      <SectionTitle eyebrow={`${total} usuario${total !== 1 ? "s" : ""}`}>Usuarios</SectionTitle>
      <SearchBar placeholder="Buscar por nombre o email…" />
      {total === 0 ? (
        <EmptyState
          icon="user"
          title="Sin usuarios"
          body={search ? "No se encontraron usuarios con ese nombre." : "Todavía no hay usuarios sincronizados desde Clerk."}
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
