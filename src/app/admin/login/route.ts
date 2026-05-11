import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "";
  const dest = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";
  return NextResponse.redirect(new URL(dest, req.url));
}
