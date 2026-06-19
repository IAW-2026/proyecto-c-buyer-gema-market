import { getAccountData } from "@/app/lib/helpers/account";
import AccountForm from "./AccountForm";

export async function AccountFetcher() {
  const datos = await getAccountData();

  if (!datos) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <p className="text-ink-3">No se pudo cargar la información de la cuenta.</p>
      </div>
    );
  }

  return <AccountForm initialData={datos} />;
}
