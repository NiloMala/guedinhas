import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isCheckoutPost = pathname === "/api/orders" && request.method === "POST";
  const isProtectedApi =
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/stock-movements") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/suppliers") ||
    pathname.startsWith("/api/upload") ||
    (pathname.startsWith("/api/orders") && !isCheckoutPost);

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!user && isAdminPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && isProtectedApi) {
    return NextResponse.json({ ok: false, message: "Nao autenticado." }, { status: 401 });
  }

  if (user && pathname === "/admin-login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin-login",
    "/api/products/:path*",
    "/api/stock-movements/:path*",
    "/api/categories/:path*",
    "/api/suppliers/:path*",
    "/api/upload/:path*",
    "/api/orders/:path*"
  ]
};
