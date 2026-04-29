import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function middleware(req: any) {
  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/((?!login).*)",
    "/admin",
    "/api/analytics/:path*",
    "/api/leads/:path*",
  ],
};
