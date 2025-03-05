"use server";
// import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation"


export async function loginUser(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  
    if (error) {
      return { error: error.message }
    }

    redirect("/dashboard")
  
  }