import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";

export async function checkAuth() {
  const session = await getUser();
  if (!session) {
    redirect("/login");
  }

  return session;
}
