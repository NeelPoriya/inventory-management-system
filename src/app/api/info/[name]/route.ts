import { createItem, getAllItems, nameToModel } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    const url = new URL(request.url);
    const pageIndex = Number(url.searchParams.get("pageIndex")) || 0;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    const model = nameToModel[name as keyof typeof nameToModel];

    const items = await getAllItems(model, pageIndex, pageSize);

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
    const body = await request.json();
    const model = nameToModel[name as keyof typeof nameToModel];

    const item = await createItem(model, body);

    return NextResponse.json({ message: "success", item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
