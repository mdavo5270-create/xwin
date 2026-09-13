import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const open = ["/login", "/register", "/legal", "/icon.svg", "/sw.js"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    open.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next();
  }
  if (!req.cookies.get("xwin_member")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"] };
