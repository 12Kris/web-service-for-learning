"use server";

import {revalidatePath} from "next/cache";
import {createClient} from "@/utils/supabase/server";
import {validateForm, FormData} from "@/utils/login/validate";

export async function registerUser(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
) {
    const supabase = await createClient();
    const formData: FormData = { name, email, password, confirmPassword };
    const validationResult = validateForm(undefined, formData);
    if (validationResult !== true) {
        return {
            data: null,
            reg_error: validationResult,
        };
    }

    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                displayName: name,
                full_name: name,
            },
        },
    });

    return {
        data: data,
        reg_error: error?.message ?? null,
    };
}

export async function loginUser(email: string, password: string) {
    const supabase = await createClient();
    const {data: user, error} = await supabase.auth.signInWithPassword({
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
