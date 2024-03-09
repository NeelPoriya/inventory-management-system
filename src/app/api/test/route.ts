import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = cookies().get("session");

  return NextResponse.json({ status: 200, session });
}
