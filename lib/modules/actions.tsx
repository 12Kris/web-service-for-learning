"use server";

import { Module } from "@/lib/types/modules";
import { getUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";

async function checkAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
}

export async function getModules(): Promise<Module[]> {
    const supabase = await createClient();
  
  await checkAuth();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `
        *,
        lessons:lessons(*)
      `
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Module[];
}

export async function getModuleById(id: string): Promise<Module | null> {
  const supabase = await createClient();

  await checkAuth();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `
        *,
        lessons:lessons(*)
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Module | null;
}

export async function createModule(input: Module): Promise<Module> {
  const supabase = await createClient();

  await checkAuth();
  const { data, error } = await supabase
    .from("modules")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Module;
}

export async function updateModule(id: string, input: Module): Promise<Module> {
  const supabase = await createClient();

  await checkAuth();
  const { data, error } = await supabase
    .from("modules")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Module;
}

export async function deleteModule(id: string): Promise<void> {
  const supabase = await createClient();

  await checkAuth();
  const { error } = await supabase.from("modules").delete().eq("id", id);

  if (error) throw error;
}
