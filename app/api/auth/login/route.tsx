import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
    const { email, password } = await request.json();

    const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
            status: 401,
        });
    }

    const headers = new Headers();
    headers.append(
        'Set-Cookie',
        `token=${user.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return new Response(JSON.stringify({ token: user.session.access_token }), {
        status: 200,
        headers,
    });
}
