import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Optional: Add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Protect all routes under /admin EXCEPT for /admin/login
export const config = {
  matcher: ["/admin/:path*", "/admin/projects/:path*"],
};
