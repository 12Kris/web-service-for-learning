import { supabase } from "@/utils/supabase/client";

export async function POST(request: Request) {
    const { email, password, confirmPassword, name } = await request.json();

    if (password !== confirmPassword) {
        return new Response(JSON.stringify({ error: "Passwords do not match" }), {
            status: 400,
        });
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });

    if (signUpError) {
        return new Response(JSON.stringify({ error: signUpError.message }), {
            status: 400,
        });
    }

    const user = signUpData.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "User registration failed" }), {
            status: 500,
        });
    }

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata.name,
            },
        }),
        { status: 201 }
    );
}
