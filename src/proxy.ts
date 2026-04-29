import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function proxy(req: any) {
  return NextResponse.next();
}

export default withAuth(proxy, {
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
