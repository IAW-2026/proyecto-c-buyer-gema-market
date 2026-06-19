import { notFound } from "next/navigation";
import { SectionTitle } from "@/app/components/ui";
import { requireAdmin } from "@/app/lib/auth/permissions";
import { getUsuarioById } from "@/app/lib/db/user";
import { UsuarioForm } from "./UserForm";

export async function UsuarioDetailContent({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const usuario = await getUsuarioById(id);
  if (!usuario) notFound();

  return (
    <>
      <SectionTitle eyebrow="Usuario">{usuario.fullName || usuario.email}</SectionTitle>
      <UsuarioForm usuario={usuario} />
    </>
  );
}
