import { getAccountData } from "@/app/lib/helpers/account";
import { parseAddress } from "@/app/lib/db/user";
import CheckoutClient from "./CheckoutClient";

export async function CheckoutFetcher() {
  const usuario = await getAccountData();
  const savedAddress = usuario ? parseAddress(usuario) : null;

  const initialAddress = {
    street: savedAddress?.street ?? "",
    number: savedAddress?.number ?? "",
    zip: savedAddress?.zip ?? "",
  };

  return <CheckoutClient initialAddress={initialAddress} />;
}
