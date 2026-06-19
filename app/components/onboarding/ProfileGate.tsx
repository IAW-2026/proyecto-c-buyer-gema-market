import { Usuario } from "@prisma/client";
import { getAccountData } from "@/app/lib/helpers/account";
import { parseAddress } from "@/app/lib/db/user";
import CompleteProfileModal from "./CompleteProfileModal";

function isProfileComplete(user: Usuario): boolean {
  if (!user.phoneNumber?.trim()) return false;
  const address = parseAddress(user);
  if (!address) return false;
  return Boolean(address.street?.trim() && address.number?.trim() && address.zip?.trim());
}

export default async function ProfileGate() {
  const dbUser = await getAccountData();

  if (!dbUser) return null;
  if (isProfileComplete(dbUser)) return null;

  return (
    <CompleteProfileModal
      fullName={dbUser.fullName ?? ""}
      email={dbUser.email ?? ""}
    />
  );
}
