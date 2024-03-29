import { checkSession, getSession } from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import Badge from "@/models/Badge.model";
import Client from "@/models/Client.model";
import Incoming from "@/models/Incoming.model";
import Order from "@/models/Order.model";
import Outgoing from "@/models/Outgoing.model";
import ProductVariant from "@/models/ProductVariant.model";
import chalk from "chalk";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
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

    const items = await getModelResultGroupedByDate(
      session,
      pageIndex,
      pageSize,
      params.name
    );

    return NextResponse.json({
      items: items[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching information", error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
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

    const items = await getQuantityInformation(
      accountObjectId,
      badgeIds,
      clientIds,
      productVariantIds,
      params.name
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching information", error },
      { status: 500 }
    );
  }
}

async function getModelResultGroupedByDate(
  session: any,
  pageIndex: number,
  pageSize: number,
  name: string
) {
  await connectDB();
  const account_id = session.user._id;
  const accountObjectId = new mongoose.Types.ObjectId(account_id);

  let model;
  let type;
  // if (name === "incoming") {
  //   model = Incoming;
  // } else if (name === "outgoing") {
  //   model = Outgoing;
  // }
  if (name === "inward") {
    model = Order;
    type = "inward";
  } else if (name === "outward") {
    model = Order;
    type = "outward";
  } else {
    throw new Error("Invalid model name");
  }

  const items = await model.aggregate([
    {
      $match: {
        $and: [
          {
            account_id: accountObjectId,
          },
          {
            type,
          },
        ],
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
        _id: { $dateToString: { date: "$date" } },
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
  return items;
}

async function getQuantityInformation(
  accountObjectId: mongoose.Types.ObjectId,
  badgeIds: string[],
  clientIds: string[],
  productVariantIds: string[],
  name: string
) {
  await connectDB();

  let model = Order;
  console.log(chalk.red(name));
  // if (name === "incoming") {
  //   model = Incoming;
  // } else if (name === "outgoing") {
  //   model = Outgoing;
  // }

  const allBadgeIds = await Badge.find({
    account_id: accountObjectId,
  }).distinct("_id");

  const allClientIds = await Client.find({
    account_id: accountObjectId,
  }).distinct("_id");

  const allProductVariantIds = await ProductVariant.find({
    account_id: accountObjectId,
  }).distinct("_id");

  const items = await model.aggregate([
    // Match documents based on provided filters
    {
      $match: {
        account_id: accountObjectId,
        type: name,
      },
    },
    {
      $match: {
        $and: [
          {
            badge_id: {
              $in: badgeIds?.map((id) => new mongoose.Types.ObjectId(id)) || [
                ...allBadgeIds.map((id) => new mongoose.Types.ObjectId(id)),
              ],
            },
          },
          {
            client_id: {
              $in: clientIds?.map((id) => new mongoose.Types.ObjectId(id)) || [
                ...allClientIds.map((id) => new mongoose.Types.ObjectId(id)),
              ],
            },
          },
          {
            product_variant_id: {
              $in: productVariantIds?.map(
                (id) => new mongoose.Types.ObjectId(id)
              ) || [
                ...allProductVariantIds.map(
                  (id) => new mongoose.Types.ObjectId(id)
                ),
              ],
            },
          },
        ],
      },
    },
    // Group by null to calculate the total quantity
    {
      $group: {
        _id: "Result",
        totalQuantity: { $sum: "$quantity" },
      },
    },
  ]);

  return items;
}
