import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const code = request.nextUrl.searchParams.get("code");

  if (isDevAuthBypassEnabled()) {
    return NextResponse.next({ request });
  }

  if (code && pathname !== "/api/auth/callback") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/auth/callback";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");
  const isResetPassword = pathname.startsWith("/reset-password");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") ||
    pathname === "/log" ||
    pathname.startsWith("/log/") ||
    pathname.startsWith("/deals") ||
    pathname.startsWith("/expenses");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (
    isAuthPage &&
    (request.nextUrl.searchParams.get("next") === "/login" ||
      request.nextUrl.searchParams.get("next") === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/clients/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/log/:path*",
    "/deals/:path*",
    "/expenses/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
