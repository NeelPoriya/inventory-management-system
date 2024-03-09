import { checkSession, getSession } from "@/lib/helper";
import chalk from "chalk";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const session = await getSession();
  if (await checkSession(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    session,
  });
}
