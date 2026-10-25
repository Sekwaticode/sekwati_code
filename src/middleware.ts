import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protects /admin and /portal, and keeps the Supabase session fresh.
const SECTIONS = [
  { home: "/admin", login: "/admin/login" },
  { home: "/portal", login: "/portal/login" },
];

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return new NextResponse("Not configured: missing Supabase environment variables.", {
      status: 500,
    });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const section =
    SECTIONS.find((s) => path === s.home || path.startsWith(`${s.home}/`)) ?? SECTIONS[0];
  const isLoginPage = path === section.login;

  const redirectTo = (pathname: string) => {
    const target = request.nextUrl.clone();
    target.pathname = pathname;
    target.search = "";
    return NextResponse.redirect(target);
  };

  if (!user && !isLoginPage) return redirectTo(section.login);
  if (user && isLoginPage) return redirectTo(section.home);

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/portal", "/portal/:path*", "/files/:path*"],
};
