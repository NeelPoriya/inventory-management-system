import { getSession } from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import { generateInvoice } from "@/lib/pdf";
import Account from "@/models/Account.model";
import Client from "@/models/Client.model";
import Order from "@/models/Order.model";
import chalk from "chalk";
import mongoose, { mongo } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "success",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    const { invoiceId, invoiceDate, clientId, startDate, endDate } = body;
    if (!invoiceId || !invoiceDate || !clientId || !startDate || !endDate) {
      throw new Error("All fields are required");
    }


    await connectDB();
    const items: {
      date: Date;
      quantity: number;
      vehicle_no: string;
      client: string;
      product: string;
      price: number;
      product_variant: string;
      badge: string;
    }[] = await Order.aggregate([
      {
        $match: {
          account_id: new mongoose.Types.ObjectId(session.user._id),
          client_id: new mongoose.Types.ObjectId(clientId),
          type: "outward",
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
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
        $unwind: "$client",
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "product_variant_id",
          foreignField: "_id",
          as: "product_variant",
        },
      },
      {
        $unwind: "$product_variant",
      },
      {
        $lookup: {
          from: "products",
          localField: "product_variant.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "badges",
          localField: "badge_id",
          foreignField: "_id",
          as: "badge",
        },
      },
      {
        $unwind: "$badge",
      },
      {
        $project: {
          _id: 0,
          date: 1,
          quantity: 1,
          client: "$client.name",
          product: "$product.name",
          price: "$product_variant.price",
          product_variant: "$product_variant.name",
          badge: "$badge.name",
          vehicle_no: 1,
          drive_name: 1,
        },
      },
    ]);

    const pdfBodyData: (string | number)[][] = [
      ["Date", "Product", "Vch Type", "Quantity", "Price", "Total Amount"],
    ];

    for (const item of items) {
      pdfBodyData.push([
        item.date.toDateString(),
        `${item.product} - ${item.product_variant}`,
        item.badge,
        item.quantity,
        item.price,
        item.quantity * item.price,
      ]);
    }

    const invoiceDetails = `Invoice ID: ${invoiceId}\nInvoice Date: ${invoiceDate}`;
    const companyDetails = `Name: ${session.user.name}\nEmail: ${session.user.email}\n\nPhone${session.user.phone}`;
    const client = await Client.findById(clientId);

    const clientDetails = `Name: ${client.name}\nReg. Address: ${client.registration_address}\n\nGST No: ${client.gst_no}`;
    const clientBillingDetails = `${client.billing_address}`;

    const doc = generateInvoice(
      invoiceDetails,
      companyDetails,
      clientDetails,
      clientBillingDetails,
      pdfBodyData
    );

    const document = doc.output("blob");
    const response = new NextResponse(document);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename=${invoiceId}.pdf`
    );

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
