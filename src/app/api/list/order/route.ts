import {
  checkSession,
  getAllItems,
  getSession,
  nameToModel,
} from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order.model";
import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    await connectDB();

    const account_id = session.user._id;
    const accountObjectId = new mongoose.Types.ObjectId(account_id);

    const items = await Order.aggregate([
      {
        $match: {
          account_id: accountObjectId,
        },
      },
      // populate badge, productvariant and client
      {
        $lookup: {
          from: "badges",
          localField: "badge_id",
          foreignField: "_id",
          as: "badge",
        },
      },
      {
        $unwind: {
          path: "$badge",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "product_variant_id",
          foreignField: "_id",
          as: "productvariant",
          pipeline: [
            {
              $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product",
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$productvariant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    return NextResponse.json({
      message: "success",
      length: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
