// import { NextResponse, NextRequest } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// const PUBLIC_PATHS = ['/login', '/signup', '/about', '/contact', '/', '/forgot-password', '/how-it-works', '/signup/confirm'];

// export async function middleware(request: NextRequest) {
//     const token = request.cookies.get('token')?.value;
//     const { pathname } = request.nextUrl;

//     if (token) {
//         const { data, error } = await supabase.auth.getUser(token);
//         if (data?.user) {
//             return NextResponse.next();
//         }
//         console.error("Token verification failed:", error);
//     }

//     if (!PUBLIC_PATHS.includes(pathname)) {
//         const loginUrl = new URL('/login', request.url);
//         return NextResponse.redirect(loginUrl);
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|api/|images/|public/|star.svg).*)',
//     ],
// };


import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';


const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/',
  '/forgot-password',
  '/how-it-works',
  '/auth/',
];

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

  // Check if the pathname starts with any of the public paths
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path));

  if (!isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|images/|public/|star.svg).*)',
  ],
};