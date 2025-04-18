// import { createClient } from '@/utils/supabase/server'


// export async function signOut() {
//     await supabase.auth.signOut()
// }



import { createBrowserClient } from '@supabase/ssr'
import type { User } from "@/lib/types/user";

// export const supabase = await createClient()

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
}

export async function getUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  return data.user as User;
}


// export async function editUser(changes: { email?: string; data?: {displayName: string} }) {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.updateUser(changes);
//   return { user: data.user, error };
// }
