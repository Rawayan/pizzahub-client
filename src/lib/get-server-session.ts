
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";

export const getServerSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};
