"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AuthCallback() {
  const router = useRouter();
    const supabase = await createClient();
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  return <p className="text-center mt-10">Redirecting...</p>;
}
