import { createItem, getAllItems, getSession, nameToModel } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
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
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized to access this resource" },
        { status: 401 }
      );
    }

    const account_id = session.user._id;

    const { name } = params;
    const body = await request.json();
    const model = nameToModel[name as keyof typeof nameToModel];

    const item = await createItem(model, body, account_id);

    return NextResponse.json({ message: "success", item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}