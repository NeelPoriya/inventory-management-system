import { getSession } from "@/lib/helper";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order.model";
import ProductVariant from "@/models/ProductVariant.model";
import { ProductVariant as PV } from "@/types/ProductVariant";
import { readFileSync } from "fs";
import jsPDF from "jspdf";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import "jspdf-autotable";

const generatePDF = (
  orders: {
    [key: string]: {
      date: string;
      inward: number;
      outward: number;
      id: string;
    }[];
  },
  productVariants: PV[]
) => {
  const doc = new jsPDF();

  // const InterBlackFont = interBlackFont;
  // doc.addFileToVFS("Inter-Black-normal.ttf", InterBlackFont);
  // doc.addFont("Inter-Black-normal.ttf", "Inter-Black", "normal");

  // doc.setFont("Inter-Black");

  // Set up the title
  doc.setFontSize(16);
  // bold
  doc.setFont("helvetica", "bold");
  doc.text(
    "SHYAM VANDANA CONSTRUCTION",
    doc.internal.pageSize.getWidth() / 2 - 50,
    20
  );

  //normal font
  doc.setFont("helvetica", "normal");
  // Set up the subtitle
  doc.setFontSize(12);
  doc.text("INVENTORY SUMMARY", doc.internal.pageSize.getWidth() / 2 - 25, 30);

  let y = 40;
  let index = 1;

  for (const [key, value] of Object.entries(orders)) {
    if (value.length === 0) continue;
    // console.log(productVariants);
    const variant = productVariants.find((pv) => {
      let id = pv._id.toString();
      return id === value[0].id.toString();
    });
    // console.log(variant);
    if (variant) {
      doc.setFontSize(12);
      doc.text(
        `${index++}. ${variant.name} - ${variant.product_id?.name}`,
        20,
        y
      );

      const columns = ["Date", "Inward", "Outward"];
      let totalIncoming = 0;
      let totalOutgoing = 0;
      value.forEach((entry) => {
        totalIncoming += entry.inward;
        totalOutgoing += entry.outward;
      });
      const rows: any = value.map((entry) => {
        return [entry.date, entry.inward.toString(), entry.outward.toString()];
      });
      rows.push(["Total", totalIncoming.toString(), totalOutgoing.toString()]);
      rows.push([
        "Difference",
        { colSpan: 2, content: (totalIncoming - totalOutgoing).toString() },
      ]);

      doc.autoTable(columns, rows, {
        startY: y + 5,
        margin: { top: 10 },
        didParseCell: function (data) {
          data.cell.styles.lineWidth = 0.1;
          data.cell.styles.lineColor = "#000000";
          if (data.row.section === "head") {
            // center align all columns
            data.cell.styles.halign = "center";
            // make them bold
            data.cell.styles.fontStyle = "bold";
          }

          if (data.row.index >= data.table.body.length - 2) {
            data.cell.styles.fontStyle = "bold";
          }

          if (data.row.section === "body" && data.column.index === 1) {
            // make color green
            data.cell.styles.textColor = "#27ae60";
            data.cell.styles.halign = "center";
          }

          if (data.row.section === "body" && data.column.index === 2) {
            data.cell.styles.textColor = "#c0392b";
            data.cell.styles.halign = "center";
          }

          if (
            data.row.section === "body" &&
            data.column.index === 1 &&
            data.row.index === data.table.body.length - 1
          ) {
            data.cell.styles.textColor =
              totalIncoming - totalOutgoing >= 0 ? "#27ae60" : "#c0392b";
            data.cell.styles.halign = "center";
          }
        },
      });

      y = doc.autoTable.previous.finalY + 10;
    }
  }

  // Generate PDF as a binary string
  const pdfOutput = doc.output();
  return pdfOutput;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
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
            date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } }, // Group by product_variant_id and date
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
          inward: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "inward"] }, "$quantity", 0], // Conditional sum for incoming
            },
          },
          outward: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "outward"] }, "$quantity", 0], // Conditional sum for outgoing
            },
          },
          id: {
            $first: "$_id.product_variant_id",
          },
        },
      },
      // sort datewise
      { $sort: { "_id.date": 1 } },
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
              inward: "$inward",
              outward: "$outward",
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
      // sort datewise
    ];

    // sort datewise
    const ordersPromise = Order.aggregate(pipeline);
    const allProductVariants = ProductVariant.find({
      account_id: userId,
    });

    const [orders, productVariants] = await Promise.all([
      ordersPromise,
      allProductVariants,
    ]);

    // const response = NextResponse.json(
    //   {
    //     message: "Hello",
    //     orders,
    //     productVariants,
    //   },
    //   {
    //     status: 200,
    //   }
    // );

    const pdf = generatePDF(orders[0], productVariants);

    const response = new Response(pdf, {
      status: 200,
    });
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      "inline; filename=inventory-summary.pdf"
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
