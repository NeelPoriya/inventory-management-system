import { nameToModel } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { name: string; id: string } }
) {
  try {
    const { name, id } = params;
    const body = await request.json();
    const model = nameToModel[name as keyof typeof nameToModel];

    const item = await model.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ message: "success", item });
  } catch (error) {
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

    await model.findByIdAndDelete(id);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
