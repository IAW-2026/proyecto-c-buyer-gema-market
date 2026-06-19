import { isAdmin } from "@/app/lib/auth/permissions";
import { validateApiKey } from "@/app/lib/utils/hmac";

export async function isAdminRequest(request: Request): Promise<boolean> {
  if (validateApiKey(request)) return true;
  return await isAdmin();
}
