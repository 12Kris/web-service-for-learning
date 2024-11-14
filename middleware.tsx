import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const PUBLIC_PATHS = ['/login', '/signup', '/about', '/contact', '/'];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    if (token) {
        const { data, error } = await supabase.auth.getUser(token);
        if (data?.user) {
            return NextResponse.next();
        }
        console.error("Token verification failed:", error);
    }

    if (!PUBLIC_PATHS.includes(pathname)) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};