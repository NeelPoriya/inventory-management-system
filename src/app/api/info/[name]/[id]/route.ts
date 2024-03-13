import {
  COOKIE_EXPIRATION_TIME,
  checkSession,
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

    const { name, id } = params;
    const body = await request.json();
    const model = nameToModel[name as keyof typeof nameToModel];

    await connectDB();
    const item = await model.findByIdAndUpdate(id, body, { new: true });
    if (!item) {
      return NextResponse.json(
        {
          error: "Item not found",
        },
        {
          status: 404,
        }
      );
    }

    if (model === Account) {
      const session = await getSession();

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

    const { name, id } = params;
    const model = nameToModel[name as keyof typeof nameToModel];
    await connectDB();
    const item = await model.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json(
        {
          error: "Item not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
