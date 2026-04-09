import { NextResponse } from "next/server";

export function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // 👇 سيب صفحة login تعدي
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};