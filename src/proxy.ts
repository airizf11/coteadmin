// coteadmin/src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { callRefreshEndpoint } from "@/lib/auth-refresh";

const ACCESS_COOKIE = process.env.JWT_COOKIE_NAME!;
const REFRESH_COOKIE = "cotebek_refresh";
const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Blokir /devtest di production
  if (
    pathname.startsWith("/devtest") &&
    process.env.NODE_ENV === "production"
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2. /login gak butuh session check
  if (pathname === "/login") return NextResponse.next();

  // 3. Access token masih ada (belum expired) → lanjut normal
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (accessToken) return NextResponse.next();

  // 4. Access token abis, coba refresh
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const refreshed = await callRefreshEndpoint(refreshToken);
  if (!refreshed) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  // 5. Berhasil refresh — set cookie baru, lanjutkan request asli
  const response = NextResponse.next();
  response.cookies.set(ACCESS_COOKIE, refreshed.accessToken, {
    ...cookieBase,
    maxAge: 60 * 15,
  });
  response.cookies.set(REFRESH_COOKIE, refreshed.refreshToken, {
    ...cookieBase,
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!login|track|manifest\\.webmanifest|icon-192\\.png|icon-512\\.png|_next/static|_next/image|favicon.ico).*)",
  ],
};
