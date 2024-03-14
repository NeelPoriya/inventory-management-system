import {
  checkSession,
  createItem,
  getAllItems,
  getSession,
  nameToModel,
} from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import chalk from "chalk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
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

    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized to access this resource" },
        { status: 401 }
      );
    }

    const account_id = session.user._id;

    const { name } = params;
    const url = new URL(request.url);
    const pageIndex = Number(url.searchParams.get("pageIndex")) || 0;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    const model = nameToModel[name as keyof typeof nameToModel];

    const items = await getAllItems(model, pageIndex, pageSize, account_id);

    return NextResponse.json({
      message: "success",
      length: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;

    if (name === "account") {
      await connectDB();
      const body = await request.json();
      const model = nameToModel[name as keyof typeof nameToModel];

      const item = await model.create(body);
      if (item) {
        return NextResponse.json({ message: "success", item }, { status: 201 });
      } else {
        return NextResponse.json(
          {
            message: "User already exists",
          },
          { status: 400 }
        );
      }
    }

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

    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized to access this resource" },
        { status: 401 }
      );
    }

    const account_id = session.user._id;

    const body = await request.json();
    const model = nameToModel[name as keyof typeof nameToModel];

    const item = await createItem(model, body, account_id);

    return NextResponse.json({ message: "success", item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
