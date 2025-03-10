import { createClient } from "@/utils/supabase/client";

// export const supabase = await createClient()

// export async function s(email: string, password: string) {
//     const supabase = await createClient()
// }

// export const supabase = await createClient()

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
}
