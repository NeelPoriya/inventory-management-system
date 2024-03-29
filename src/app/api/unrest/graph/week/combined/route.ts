import { checkSession, getSession } from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import Incoming from "@/models/Incoming.model";
import Order from "@/models/Order.model";
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

    await connectDB();

    const currentDate = new Date();

    // Get the start of the current week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(
      0,
      0,
      0,
      0 - startOfWeek.getDay() * 24 * 60 * 60 * 1000
    );

    // Get the end of the current week
    const endOfWeek = new Date(currentDate);
    endOfWeek.setHours(
      23,
      59,
      59,
      999 + (6 - endOfWeek.getDay()) * 24 * 60 * 60 * 1000
    );

    const accountObjectId = new mongoose.Types.ObjectId(session.user._id);

    // Build the aggregation pipeline
    const incomingItems = await Order.aggregate([
      // Match documents for the current week
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek },
          account_id: accountObjectId,
          type: "inward",
        },
      },
      // Project day of week and quantity
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$date" }, // Extract day of week (1 for Sunday, 2 for Monday, etc.)
          quantity: "$quantity", // Assuming there's a 'quantity' field in Incoming model
        },
      },
      // Group by day of week and calculate total quantity
      {
        $group: {
          _id: "$dayOfWeek", // Group by day of week
          totalQuantity: { $sum: "$quantity" }, // Calculate total quantity
        },
      },
    ]);

    console.log(incomingItems);

    // Build the aggregation pipeline
    const outgoingItems = await Order.aggregate([
      // Match documents for the current week
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek },
          account_id: accountObjectId,
          type: "outward",
        },
      },
      // Project day of week and quantity
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$date" }, // Extract day of week (1 for Sunday, 2 for Monday, etc.)
          quantity: "$quantity", // Assuming there's a 'quantity' field in Incoming model
        },
      },
      // Group by day of week and calculate total quantity
      {
        $group: {
          _id: "$dayOfWeek", // Group by day of week
          totalQuantity: { $sum: "$quantity" }, // Calculate total quantity
        },
      },
    ]);

    const allDaysOfWeek = [];
    for (let i = 1; i <= 7; i++) {
      const dayOfWeek = incomingItems.find((item) => item._id === i);
      const dayOfWeekOutgoing = outgoingItems.find((item) => item._id === i);

      allDaysOfWeek.push({
        dayOfWeek: getDayName(i),
        incoming: dayOfWeek ? dayOfWeek.totalQuantity : 0,
        outgoing: dayOfWeekOutgoing ? dayOfWeekOutgoing.totalQuantity : 0,
      });
    }

    return NextResponse.json({
      items: allDaysOfWeek,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching information", error },
      { status: 500 }
    );
  }
}

function getDayName(dayNumber: number) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[dayNumber - 1] || "Unknown";
}
