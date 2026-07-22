import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnvironment } from "@/src/infrastructure/config/env";

type RouteGroups = { protectedPrefixes: string[]; authEntryRoutes: string[] };

export async function updateSession(request: NextRequest, baseResponse: NextResponse, logicalPath: string, routes: RouteGroups) {
  const env = getPublicEnvironment();
  let response = baseResponse;
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);
  const isProtected = routes.protectedPrefixes.some((prefix) => logicalPath === prefix || logicalPath.startsWith(`${prefix}/`));
  const isAuthEntry = routes.authEntryRoutes.includes(logicalPath);

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthEntry && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
