"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// export const supabase = await createClient()

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user.");
  }
  return data.user;
}

// New editUser function to update user details.
// export async function editUser(changes: { email?: string; data?: {displayName: string} }) {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.updateUser(changes);
//   return { user: data.user, error };
// }
