"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getToken() {
  const token = (await cookies()).get("token")?.value;
  return token || null;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  revalidatePath("/login");
  return true;
}

export async function getUser() {
  const token = await getToken();
  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error("Failed to fetch user");
  }
  return user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName: name },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  const user = signUpData.user;
  if (!user) {
    throw new Error("User registration failed");
  }
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata.displayName,
  };
}

export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error("Invalid email or password");
  }
  const token = user.session?.access_token;
  if (!token) {
    throw new Error("Authentication failed: token missing");
  }
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    // httpOnly: true,
    secure: false,
    // domain: "localhost",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}