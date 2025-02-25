import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/contact",
  "/forgot-password",
  "/how-it-works",
  "/auth/",
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(path))
  );

  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!isPublicPath) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (e) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|images/|public/|star.svg).*)",
  ],
};
