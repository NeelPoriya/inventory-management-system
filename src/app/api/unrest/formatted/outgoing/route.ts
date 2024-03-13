import { checkSession, getSession } from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import Outgoing from "@/models/Outgoing.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (await checkSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized to access this resource" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const pageIndex = Number(url.searchParams.get("pageIndex")) || 0;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const account_id = session.user._id;

    await connectDB();
    const accountObjectId = new mongoose.Types.ObjectId(account_id);

    const items = await Outgoing.aggregate([
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
        $group: {
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$date" } },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: -1 }, // Sort by date in descending order
      },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                pageIndex,
                pageSize,
                next: {
                  $cond: [
                    { $gte: ["$total", pageIndex * pageSize + pageSize] },
                    true,
                    false,
                  ],
                },
                nextUrl: {
                  $cond: [
                    { $gte: ["$total", pageIndex * pageSize + pageSize] },
                    {
                      $concat: [
                        "/api/unrest/formatted/incoming?pageIndex=",
                        { $toString: pageIndex + 1 },
                        "&pageSize=",
                        { $toString: pageSize },
                      ],
                    },
                    null,
                  ],
                },
              },
            },
          ],
          data: [{ $skip: pageIndex * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    return NextResponse.json({
      items: items[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching incoming" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (await checkSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized to access this resource" },
        { status: 401 }
      );
    }

    const {
      badgeIds,
      clientIds,
      productVariantIds,
    }: {
      badgeIds: string[];
      clientIds: string[];
      productVariantIds: string[];
    } = await request.json();

    const account_id = session.user._id;
    const accountObjectId = new mongoose.Types.ObjectId(account_id);

    await connectDB();
    const items = await Outgoing.aggregate([
      // Match documents based on provided filters
      {
        $match: {
          account_id: accountObjectId,
        },
      },
      {
        $match: {
          $or: [
            {
              badge_id: {
                $in:
                  badgeIds?.map((id) => new mongoose.Types.ObjectId(id)) || [],
              },
            },
            {
              client_id: {
                $in:
                  clientIds?.map((id) => new mongoose.Types.ObjectId(id)) || [],
              },
            },
            {
              product_variant_id: {
                $in:
                  productVariantIds?.map(
                    (id) => new mongoose.Types.ObjectId(id)
                  ) || [],
              },
            },
          ],
        },
      },
      // Group by null to calculate the total quantity
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }, // Assuming there's a 'quantity' field in Incoming model
        },
      },
    ]);

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching incoming" },
      { status: 500 }
    );
  }
}
