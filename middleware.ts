import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function adminBase() {
  const raw = process.env.ADMIN_PATH || "";
  if (!raw.startsWith("/") || raw === "/" || raw.startsWith("/admin")) return "";
  return raw.replace(/\/+$/, "");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const base = adminBase();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse(null, { status: 404 });
  }

  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin" + pathname.slice(base.length);
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/app") && !req.cookies.get("xwin_member")) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"] };
