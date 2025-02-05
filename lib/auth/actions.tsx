// "use server";

// import {supabase} from "@/lib/supabaseClient";
// import {revalidatePath} from "next/cache";
// import {cookies} from "next/headers";
// import {User} from "@/lib/definitions";

// export async function getToken() {
//     const token = (await cookies()).get("token")?.value;
//     return token || null;
// }

// export async function logoutUser() {
//     const cookieStore = await cookies();
//     cookieStore.delete("token");
//     revalidatePath("/login");
//     return true;
// }

// export async function getUser() {
//     const token = await getToken();
//     if (!token) {
//         return null;
//     }

//     const {
//         data: {user},
//         error,
//     } = await supabase.auth.getUser(token);
//     if (error || !user) {
//         throw new Error("Failed to fetch user");
//     }
//     return user as unknown as User;
// }

// export async function registerUser(
//     name: string,
//     email: string,
//     password: string,
//     confirmPassword: string
// ) {
//     if (password !== confirmPassword) {
//         throw new Error("Passwords do not match");
//     }
//     const {data: signUpData, error} = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//             data: {displayName: name},
//         },
//     });
//     if (error) {
//         throw new Error(error.message);
//     }
//     const user = signUpData.user;
//     if (!user) {
//         throw new Error("User registration failed");
//     }
//     return {
//         id: user.id,
//         email: user.email,
//         name: user.user_metadata.displayName,
//     };
// }

// export async function loginUser(email: string, password: string) {
//     const {data: user, error} = await supabase.auth.signInWithPassword({
//         email,
//         password,
//     });
//     if (error) {
//         throw new Error("Invalid email or password");
//     }
//     const token = user.session?.access_token;
//     if (!token) {
//         throw new Error("Authentication failed: token missing");
//     }
//     const cookieStore = await cookies();
//     cookieStore.set({
//         name: "token",
//         value: token,
//         // httpOnly: true,
//         secure: false,
//         // domain: "localhost",
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//     });
//     return token;
// }


"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {User} from "@/lib/definitions";
import jwt from "jsonwebtoken"


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
        data: {user},
        error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
        throw new Error("Failed to fetch user");
    }
    return user as unknown as User;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword) {
    return {
        data: null,
        error: "Passwords do not match",
    };
  };

  
  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName: name },
    },
  });

  
  if (error) {
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
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) {
    throw new Error("SUPABASE_JWT_SECRET is not defined");
  }
  const token = jwt.sign({ email, password }, secret, { expiresIn: "1h" });
  return {
    data: {
      id: user.id,
    email: user.email,
    name: user.user_metadata.displayName,
    token: token,
    },
    error: null,
  };
}

export async function loginUser(email: string, password: string) {
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

  console.log("Resending confirmation email...")

  // Revalidate the current path to reflect any changes
  revalidatePath("/confirm-email")
}

export async function alreadyConfirmed(login:string, password:string) {
  if (!login || !password) {
    return {
      data: null,
      error: "Please enter your email and password",
    };
  }
  const result = await loginUser(login, password);
  return result;
}