import { createClient } from "@/utils/supabase/client";

// export const supabase = await createClient()

// export async function s(email: string, password: string) {
//     const supabase = await createClient()
// }

// export const supabase = await createClient()

export async function signOut() {
  const supabase = await createClient();
  console.log("supabase, logged out", supabase);
  const { error } = await supabase.auth.signOut();
}
