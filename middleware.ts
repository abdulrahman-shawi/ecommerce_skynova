import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware — Edge Runtime Compatible
 * Uses getToken() from next-auth/jwt (uses jose, NOT bcryptjs)
 * DO NOT import auth.ts here — it imports bcryptjs which breaks Edge Runtime
 */

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Read JWT token from cookie (Edge-safe, no bcryptjs)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = (token?.role as string) || "";
  const isAffiliate = (token?.isAffiliate as boolean) || false;

  // Route flags
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = nextUrl.pathname === "/login";
  const isRegisterPage = nextUrl.pathname === "/register";

  // ── 1. Not logged in → redirect to login ──
  if (!isLoggedIn) {
    if (isAdminRoute || isDashboardRoute) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // ── 2. Logged in → redirect away from login/register ──
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // ── 3. Admin routes → ADMIN only ──
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // ── 4. Dashboard → ADMIN, MANAGER, or affiliate ──
  if (isDashboardRoute) {
    const canAccess =
      userRole === "ADMIN" || userRole === "MANAGER" || isAffiliate;

    if (!canAccess) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};