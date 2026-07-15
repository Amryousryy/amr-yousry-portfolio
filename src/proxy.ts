import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function middleware() {
  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/admin/((?!login).*)",
    "/admin",
  ],
};
