"use server";

// import { supabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import jwt from "jsonwebtoken";
import { createClient } from "@/utils/supabase/server";

// export async function getToken() {
//   const token = (await cookies()).get("token")?.value;
//   return token || null;
// }

// export async function logoutUser() {
//   const cookieStore = await cookies();
//   cookieStore.delete("token");
//   // revalidatePath("/login");
//   return true;
// }

// export async function getUser() {
//   const token = await getToken();
//   if (!token) {
//     return null;
//   }

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser(token);
//   if (error || !user) {
//     throw new Error("Failed to fetch user");
//   }
//   return user;
// }

export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  const supabase = await createClient();
  if (password !== confirmPassword) {
    return {
      data: null,
      error: "Passwords do not match",
    };
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName: name },
    },
  });

 

  if (error) {
    console.log("signUpData", error);
    return {
      data: null,
      error: error.message,
    };
  }
  const user = signUpData.user;
  if (!user) {
    return {
      data: null,
      error: "Registration failed",
    };
  }
  // const secret = process.env.SUPABASE_JWT_SECRET;
  // if (!secret) {
  //   throw new Error("SUPABASE_JWT_SECRET is not defined");
  // }
  // const token = jwt.sign({ email, password }, secret, { expiresIn: "1h" });
  // return {
  //   data: {
  //     id: user.id,
  //     email: user.email,
  //     name: user.user_metadata.displayName,
  //     token: token,
  //   },
  //   error: null,
  // };
}

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return {
      data: null,
      error: error.message,
    };
  }
  const token = user.session?.access_token;
  if (!token) {
    return {
      data: null,
      error: "token not found",
    };
  }

  return {
    data: {
      token: token,
    },
    error: null,
  };
}

export async function resendConfirmationEmail() {
  // TODO: Implement the logic to resend the confirmation email
  // This is where you would typically call your authentication service
  // to resend the confirmation email

  // Revalidate the current path to reflect any changes
  revalidatePath("/confirm-email");
}

export async function alreadyConfirmed(login: string, password: string) {
  if (!login || !password) {
    return {
      data: null,
      error: "Please enter your email and password",
    };
  }
  const result = await loginUser(login, password);
  return result;
}
