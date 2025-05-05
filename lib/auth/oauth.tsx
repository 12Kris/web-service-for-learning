"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const signInWithProvider = async (
  provider: "google" | "facebook" | "twitter"
) => {
  const supabase = createClientComponentClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `https://cqjdfqvsugylfvxtiktg.supabase.co/auth/v1/callback`,
    },
  });

  if (error) {
    console.error("OAuth login error:", error.message);
    throw new Error(error.message);
  }
};