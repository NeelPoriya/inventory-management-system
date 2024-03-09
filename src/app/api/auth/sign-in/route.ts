import { COOKIE_EXPIRATION_TIME, checkLogin, encrypt } from "@/lib/helper";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await checkLogin({ username, password });
    if (!user) throw new Error("Invalid username or password");

    const expires = new Date(Date.now() + COOKIE_EXPIRATION_TIME);
    const session = await encrypt({ user, expires });

    cookies().set("session", session, {
      expires,
      httpOnly: true,
    });

    return NextResponse.json({ status: "success", user });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error },
      { status: 500 }
    );
  }
}
