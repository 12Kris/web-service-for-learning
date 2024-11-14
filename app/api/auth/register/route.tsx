import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
    const { email, password, confirmPassword, name } = await request.json();

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
        return new Response(JSON.stringify({ error: "Passwords do not match" }), {
            status: 400,
        });
    }

    // Регистрация пользователя через Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });

    // Обработка ошибки регистрации
    if (signUpError) {
        return new Response(JSON.stringify({ error: signUpError.message }), {
            status: 400,
        });
    }

    // Проверка успешного создания пользователя
    const user = signUpData.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "User registration failed" }), {
            status: 500,
        });
    }

    // Возвращаем данные о пользователе
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
