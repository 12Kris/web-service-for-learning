import { createClient } from "@/utils/supabase/client";
import type { Profile, User, UserMetadata } from "@/lib/types/user";

// export const supabase = await createClient()

// export async function s(email: string, password: string) {
//     const supabase = await createClient()
// }

// export const supabase = await createClient()

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
}

export async function editUser(changes: { email?: string; data?: {display_name?: string; full_name?:string; avatar_url?: string; website?: string; bio?: string; location?: string;} }) {
  if (!changes || Object.keys(changes).length === 0) {
    return { error: "No data provided" };
  }

  console.log('changes', changes);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    email: changes.email,
    data: changes.data,
  });
  return { user: data?.user, error };
}

// get user by id
// export async function getUserById(userId: string) {
//   const supabase = await createClient();
//   const { data, error } = await supabase.from("profiles").select().eq("id", userId);
//   return data;
// }

export async function getProfileById(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select().eq("id", userId).single();
  return data as Profile;
}