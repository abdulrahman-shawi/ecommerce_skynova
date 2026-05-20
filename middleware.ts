import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const isAffiliate = req.auth?.user?.isAffiliate;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAffiliateRoute = nextUrl.pathname.startsWith("/dashboard/affiliate");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isApiProtectedRoute = nextUrl.pathname.startsWith("/api/protected");
  const isLoginPage = nextUrl.pathname === "/login";
  const isRegisterPage = nextUrl.pathname === "/register";

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    if (isAdminRoute || isDashboardRoute || isApiProtectedRoute || isAffiliateRoute) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect authenticated users away from login/register pages
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Admin routes - only ADMIN (accountType = ADMIN)
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Affiliate routes - only users with isAffiliate=true or ADMIN
  if (isAffiliateRoute && !isAffiliate && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Dashboard routes - must be affiliate or ADMIN or MANAGER
  if (isDashboardRoute) {
    // Allow if: ADMIN, MANAGER, or isAffiliate=true
    const canAccessDashboard =
      userRole === "ADMIN" || userRole === "MANAGER" || isAffiliate === true;

    if (!canAccessDashboard) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/login",
    "/register",
  ],
};
