import { getSession } from "@/lib/helper";
import Order from "@/models/Order.model";
import ProductVariant from "@/models/ProductVariant.model";
import jsPDF from "jspdf";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = session.user._id;

    const pipeline = [
      {
        $match: {
          account_id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            product_variant_id: "$product_variant_id",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by product_variant_id and date
            type: "$type", // Include type in grouping to differentiate between incoming and outgoing
          },
          quantity: { $sum: "$quantity" }, // Sum up quantities
        },
      },

      {
        $group: {
          _id: {
            product_variant_id: "$_id.product_variant_id",
            date: "$_id.date",
          },
          incoming: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "inward"] }, "$quantity", 0], // Conditional sum for incoming
            },
          },
          outgoing: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "outward"] }, "$quantity", 0], // Conditional sum for outgoing
            },
          },
          id: {
            $first: "$_id.product_variant_id",
          },
        },
      },
      {
        $lookup: {
          from: "productvariants", // Ensure this matches the actual collection name for ProductVariant in your database
          localField: "_id.product_variant_id",
          foreignField: "_id",
          as: "productVariantDetails",
        },
      },
      {
        $unwind: {
          path: "$productVariantDetails",
          preserveNullAndEmptyArrays: true, // This ensures that if there's no matching document in ProductVariant, the order still appears in the result
        },
      },
      {
        $group: {
          _id: "$_id.product_variant_id",
          dates: {
            $push: {
              date: "$_id.date",
              incoming: "$incoming",
              outgoing: "$outgoing",
              id: "$id",
            },
          },
          productVariantName: { $first: "$productVariantDetails.name" }, // Assuming ProductVariant has a 'name' field; adjust accordingly
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            k: "$productVariantName", // This is the key for the object
            v: "$dates",
          },
        },
      },
      {
        $group: {
          _id: null,
          variants: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$variants",
          },
        },
      },
    ];

    const orders = await Order.aggregate(pipeline);

    const response = NextResponse.json(
      {
        message: "Hello",
        orders,
      },
      {
        status: 200,
      }
    );

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the PDF",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
