'use server';

import { supabase } from "@/lib/supabaseClient";
import { cookies } from 'next/headers';
import {User} from "@/lib/courses/types";

export async function getToken() {
    const token = (await cookies()).get('token')?.value;
    return token || null;
}

export async function getUser(): Promise<User | null> {
    const token = await getToken();
    if (!token) {
        return null;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
        console.error("Failed to fetch user:", error?.message);
        return null;
    }

    const { id, email, user_metadata, created_at } = data.user;

    return {
        id: id,
        email: email || "",
        full_name: user_metadata?.full_name || "",
        avatar: user_metadata?.avatar || "",
        role: user_metadata?.role || "user",
        joinDate: created_at || "",
    };
}


export async function registerUser(name: string, email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }
    const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    });
    if (error) {
        throw new Error(error.message);
    }
    const user = signUpData.user;
    if (!user) {
        throw new Error("User registration failed");
    }
    return { id: user.id, email: user.email, name: user.user_metadata.name };
}

export async function loginUser(email: string, password: string) {
    const { data: user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw new Error("Invalid email or password");
    }
    const token = user.session?.access_token;
    if (!token) {
        throw new Error("Authentication failed: token missing");
    }
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
    return token;
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}
