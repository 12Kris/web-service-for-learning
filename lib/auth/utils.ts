// "use client";

// // import { getUser } from "@/lib/auth/actions";
// import { redirect } from "next/navigation";




// import { supabase } from "@/utils/supabase/client";

// // Since localStorage is a synchronous API, we can keep this function synchronous,
// // but marking it async avoids issues if it's interpreted as a server action.
// export async function getToken(): Promise<string | null> {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return null;
// }

// export async function logoutUser(): Promise<boolean> {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("token");
//   }
//   // Sign out from Supabase as well to clear the session on the backend.
//   const { error } = await supabase.auth.signOut();
//   if (error) {
//     console.error("Error signing out:", error.message);
//   }
//   return true;
// }
// // import { supabase } from "@/lib/supabaseClient";

// export async function getUser() {
//   const { data: { user }, error } = await supabase.auth.getUser();
//   if (error || !user) {
//     // If error message indicates missing session, it's expected when not logged in.
//     if (error?.message !== "Auth session missing!") {
//       console.error("Failed to fetch user:", error?.message);
//     }
//     return null;
//   }
//   return user;
// }
// // export async function getUser() {
// //   // Let Supabase handle session retrieval from its internal storage.
// //   const { data: { user }, error } = await supabase.auth.getUser();
// //   if (error || !user) {
// //     console.error("Failed to fetch user:", error?.message);
// //     return null;
// //   }
// //   return user;
// // }

// // import { redirect } from "next/navigation";

// export async function checkAuth() {
//   const session = await getUser();
//   console.log("session", session);
//   if (!session) {
//     redirect("/login");
//   }
//   return session;
// }
