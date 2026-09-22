import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    console.error("Supabase auth error:", error.message);
  }

  const claims = data?.claims;
  const isLoggedIn = Boolean(claims);
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
