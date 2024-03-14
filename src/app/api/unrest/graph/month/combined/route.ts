import { checkSession, getSession } from "@/lib/helper";
import Incoming from "@/models/Incoming.model";
import Outgoing from "@/models/Outgoing.model";
import { NextRequest, NextResponse } from "next/server";

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

    const currentDate = new Date();

    // Get the start of the current month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    startOfMonth.setHours(0, 0, 0, 0);

    // Get the end of the current month
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    endOfMonth.setHours(23, 59, 59, 999);

    const incomingItems = await Incoming.aggregate([
      // Match documents for the current month
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      // Project day of month and quantity
      {
        $project: {
          dayOfMonth: { $dayOfMonth: "$date" }, // Extract day of month (1-31)
          quantity: "$quantity", // Assuming there's a 'quantity' field in Incoming model
        },
      },
      // Group by day of month and calculate total quantity
      {
        $group: {
          _id: "$dayOfMonth", // Group by day of month
          totalQuantity: { $sum: "$quantity" }, // Calculate total quantity
        },
      },
    ]);

    const outgoingItems = await Outgoing.aggregate([
      // Match documents for the current month
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      // Project day of month and quantity
      {
        $project: {
          dayOfMonth: { $dayOfMonth: "$date" }, // Extract day of month (1-31)
          quantity: "$quantity", // Assuming there's a 'quantity' field in Incoming model
        },
      },
      // Group by day of month and calculate total quantity
      {
        $group: {
          _id: "$dayOfMonth", // Group by day of month
          totalQuantity: { $sum: "$quantity" }, // Calculate total quantity
        },
      },
    ]);

    const allDaysOfMonth = [];
    const totalDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const dayOfMonth = incomingItems.find((item) => item._id === i);
      const outgoingDayOfMonth = outgoingItems.find((item) => item._id === i);

      allDaysOfMonth.push({
        dayOfWeek: i,
        incoming: dayOfMonth ? dayOfMonth.totalQuantity : 0,
        outgoing: outgoingDayOfMonth ? outgoingDayOfMonth.totalQuantity : 0,
      });
    }

    return NextResponse.json({
      items: allDaysOfMonth,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error. Please try again later.",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
