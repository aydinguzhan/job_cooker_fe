import { getDecodedUser } from "../lib/auth";

export function usePermisson(roleId: string) {
  const user = getDecodedUser();
  return { isPermisson: user.role === roleId };
}
