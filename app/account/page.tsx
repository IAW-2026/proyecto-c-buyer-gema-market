import React from "react";
import { TopBar } from "@/app/components/ui";
import { getAccountData } from "@/app/lib/helpers/account";
import AccountForm from "../components/features/account/AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const datos = await getAccountData();

  if (!datos) {
    // Podríamos mostrar un error o redireccionar
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <p className="text-ink-3">
          No se pudo cargar la información de la cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-[188px] lgx:pt-8 lgx:px-7 lgx:pb-32">
      <div className="lgx:hidden">
        <TopBar title="Cuenta" />
      </div>

      <AccountForm initialData={datos} />
    </div>
  );
}
