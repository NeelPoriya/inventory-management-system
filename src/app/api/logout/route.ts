import { logout } from "@/lib/helper";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
