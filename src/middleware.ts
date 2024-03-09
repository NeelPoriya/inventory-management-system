import { updateSession } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.includes("/auth/sign-in") ||
    request.nextUrl.pathname.includes("/auth/sign-up") ||
    request.nextUrl.pathname.includes("_next/static") ||
    request.nextUrl.pathname.includes("/api/auth/") ||
    request.nextUrl.pathname.includes("/favicon.ico") ||
    request.nextUrl.pathname.includes("/_next/data") ||
    request.nextUrl.pathname.includes("/_next/image")
  ) {
    return NextResponse.next();
  }

  return await updateSession(request);
}
