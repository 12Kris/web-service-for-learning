import { createClient } from "@/utils/supabase/client";
import type { Profile } from "@/lib/types/user";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function editUser(changes: {
  email?: string;
  data?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    website?: string;
    bio?: string;
    location?: string;
  };
}) {
  if (!changes || Object.keys(changes).length === 0) {
    return { error: "No data provided" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    email: changes.email,
    data: changes.data,
  });
  return { user: data?.user, error };
}

export async function getProfileById(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();
  return data as Profile;
}
