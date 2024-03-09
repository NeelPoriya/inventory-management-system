import {
  COOKIE_EXPIRATION_TIME,
  decrypt,
  encrypt,
  getSession,
  nameToModel,
} from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import Account from "@/models/Account.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { name: string; id: string } }
) {
  try {
    const { name, id } = params;
    const body = await request.json();
    const model = nameToModel[name as keyof typeof nameToModel];

    await connectDB();
    const item = await model.findByIdAndUpdate(id, body, { new: true });

    if (model === Account) {
      const session = await getSession();
      console.log(session);

      session.user = item;
      session.expires = new Date(Date.now() + COOKIE_EXPIRATION_TIME);

      cookies().set({
        name: "session",
        value: await encrypt(session),
        httpOnly: true,
        expires: session.expires,
      });
    }

    return NextResponse.json({ message: "success", item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string; id: string } }
) {
  try {
    const { name, id } = params;
    const model = nameToModel[name as keyof typeof nameToModel];

    await connectDB();
    await model.findByIdAndDelete(id);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
