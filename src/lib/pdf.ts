import { jsPDF } from "jspdf";
import { some_font_encoding, open_sans_bold, open_sans_regular } from "./fonts";
import "jspdf-autotable";

const converter = require("number-to-words");

const TINY_GAP = 4;
const SMALL_GAP = TINY_GAP * 2;
const MEDIUM_GAP = TINY_GAP * 3;
const BIG_GAP = TINY_GAP * 6;

const SMALL_FONT = 6;
const SEMI_SMALL_FONT = 8;
const MEDIUM_FONT = 10;
const REGULAR_FONT = 12;
const BIG_FONT = 16;

const FONT = "OpenSans";

/**
 * Generate invoice
 * @returns {jsPDF} - PDF document
 * @param {string} invoiceDetails - Invoice details
 * @param {string} companyDetails - Company details
 * @param {string} buyerDetails - Buyer details
 * @param {string} buyerBillingAddress - Buyer billing address
 * @param {Array<Array<string>>} tableBody - Table body
 */

export function generateInvoice(
  invoiceDetails = "Invoice Number: #12345\nIssue Date: 29th March 2024\nDue Date: 5th April 2024",
  companyDetails = "Company Name\nYour Company Name\nYour Company Address\nCity, State, ZIP\nPhone: (123) 456-7890\nEmail: info@yourcompany.com",
  buyerDetails = "Buyer Name\nBuyer Company Name\nBuyer Address\nCity, State, ZIP\nPhone: (123) 456-7890\nEmail: info@yourcompany.com",
  buyerBillingAddress = "Buyer Address\nCity, State, ZIP",
  tableBody: (number | string)[][] = [
    ["Date", "Product", "Vch Type", "Quantity", "Unit Price", "Total Price"],
    ["25-Mar-2023", "By 18 % Local Purchase", "Purchase", "200", "50", "10000"],
    ["25-Mar-2023", "By 18 % Local Purchase", "Purchase", "200", "50", "10000"],
    ["25-Mar-2023", "By 18 % Local Purchase", "Purchase", "200", "50", "10000"],
    ["25-Mar-2023", "By 18 % Local Purchase", "Purchase", "200", "50", "10000"],
    ["25-Mar-2023", "By 18 % Local Purchase", "Purchase", "200", "50", "10000"],
    ["25-Mar-2023", "By 18 % Local Purchase", "Purchase", "200", "50", "10000"],
  ]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.addFileToVFS("my-font.ttf", some_font_encoding);
  doc.addFileToVFS("OpenSans-Regular.ttf", open_sans_regular);
  doc.addFileToVFS("OpenSans-Bold.ttf", open_sans_bold);

  doc.addFont("my-font.ttf", "myfont", "normal");
  doc.addFont("OpenSans-Regular.ttf", "OpenSans", "normal");
  doc.addFont("OpenSans-Bold.ttf", "OpenSans", "bold");

  doc.setFont(FONT, "normal");
  let currentHeight = 20;

  const borderSize = 0.2;

  const totalAmount = tableBody
    .map((row) => Number.parseInt(row[5] as string) || 0)
    .reduce((a, b) => a + b, 0);

  const cgst = totalAmount * 0.09;
  const sgst = totalAmount * 0.09;
  const finalAmount = totalAmount + cgst + sgst;

  // @ts-ignore
  doc.autoTable({
    startY: currentHeight,
    head: [
      [
        {
          content: "Invoice",
          colSpan: 6,
          styles: {
            textColor: "black",
            fillColor: [255, 255, 255],
            halign: "left",
            fontSize: 15,
            lineWidth: {
              right: borderSize,
              bottom: 0,
              top: borderSize,
              left: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: invoiceDetails,
          colSpan: 6,
          styles: {
            halign: "left",
            textColor: "black",
            fillColor: [255, 255, 255],
            fontSize: 10,
            lineWidth: {
              right: borderSize,
              bottom: borderSize,
              top: 0,
              left: borderSize,
            },
            fontStyle: "normal",
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: "",
          colSpan: 6,
          styles: {
            fillColor: [255, 255, 255],
            lineWidth: {
              top: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: "Company Details:",
          colSpan: 6,
          styles: {
            textColor: "black",
            fillColor: [255, 255, 255],
            halign: "left",
            fontSize: 14,
            lineWidth: {
              right: borderSize,
              bottom: 0,
              top: borderSize,
              left: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: companyDetails,
          colSpan: 6,
          styles: {
            textColor: "black",
            fillColor: [255, 255, 255],
            halign: "left",
            fontSize: 10,
            fontStyle: "normal",
            lineWidth: {
              right: borderSize,
              bottom: borderSize,
              top: 0,
              left: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: "Buyer Details:",
          colSpan: 3,
          styles: {
            textColor: "black",
            fillColor: [255, 255, 255],
            halign: "left",
            fontSize: 14,
            lineWidth: {
              right: borderSize,
              bottom: 0,
              top: borderSize,
              left: borderSize,
            },
            lineColor: "black",
          },
        },
        {
          content: "Billing Address",
          colSpan: 3,
          styles: {
            fillColor: [255, 255, 255],
            textColor: "black",
            fontSize: 14,
            halign: "left",
            lineWidth: {
              left: borderSize,
              right: borderSize,
              bottom: 0,
              top: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: buyerDetails,
          colSpan: 3,
          styles: {
            textColor: "black",
            fillColor: [255, 255, 255],
            halign: "left",
            fontSize: 10,
            fontStyle: "normal",
            lineWidth: {
              right: borderSize,
              bottom: borderSize,
              top: 0,
              left: borderSize,
            },
            lineColor: "black",
          },
        },
        {
          content: buyerBillingAddress,
          colSpan: 3,
          styles: {
            textColor: "black",
            fillColor: [255, 255, 255],
            halign: "left",
            fontSize: 10,
            fontStyle: "normal",
            lineWidth: {
              right: borderSize,
              bottom: borderSize,
              top: 0,
              left: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
      [
        {
          content: "",
          colSpan: 6,
          styles: {
            fillColor: [255, 255, 255],
            lineWidth: {
              top: borderSize,
            },
            lineColor: "black",
          },
        },
      ],
    ],
    body: [
      ...tableBody,
      // total row
      [
        {
          content: "CGST",
          colSpan: 5,
          styles: {
            halign: "right",
            fontStyle: "bold",
          },
        },
        cgst,
      ],
      [
        {
          content: "SGST",
          colSpan: 5,
          styles: {
            halign: "right",
            fontStyle: "bold",
          },
        },
        sgst,
      ],
      [
        {
          content: "Total",
          colSpan: 5,
          styles: {
            halign: "right",
            fontStyle: "bold",
          },
        },
        finalAmount,
      ],
      [
        {
          content: "In Words: ",
          styles: {
            fontStyle: "bold",
          },
        },
        {
          content: converter.toWords(finalAmount).toLocaleUpperCase() + " ONLY",
          colSpan: 5,
          styles: {
            fontStyle: "normal",
          },
        },
      ],
    ],
    bodyStyles: {
      lineWidth: 0.2,
      lineColor: "black",
      textColor: "black",
      font: FONT,
      fontSize: 9,
    },
    headStyles: {
      lineWidth: 0.2,
      lineColor: "black",
      textColor: "black",
      font: FONT,
    },
    columnStyles: {
      2: {
        fontStyle: "bold",
      },
      4: {
        halign: "right",
      },
      3: {
        halign: "right",
      },
    },
    didParseCell: function (data: any) {
      if (data.row.section === "body" && data.row.index === 0) {
        data.cell.styles.fontStyle = "bold";
      }
    },
    theme: "grid",
  });

  doc.setFontSize(MEDIUM_FONT);
  doc.text(
    "Payment Terms: Payment is due within 7 days of invoice date.\nThank you for your business!",
    15,
    // @ts-ignore
    doc.autoTable.previous.finalY + 10,
    {
      align: "left",
    }
  );

  // signature placeholder underlines with text: Authorized Signature
  doc.setLineWidth(0.5);
  doc.setDrawColor(0);
  doc.line(
    15,
    // @ts-ignore
    doc.autoTable.previous.finalY + 40,
    60,
    // @ts-ignore
    doc.autoTable.previous.finalY + 40
  );
  // @ts-ignore
  doc.text("Authorized Signature", 15, doc.autoTable.previous.finalY + 45, {
    align: "left",
  });

  // signature placeholder underlines with text: Date
  doc.setLineWidth(0.5);
  doc.setDrawColor(0);
  doc.line(
    150,
    // @ts-ignore
    doc.autoTable.previous.finalY + 40,
    190,
    // @ts-ignore
    doc.autoTable.previous.finalY + 40
  );
  // @ts-ignore
  doc.text("Date", 150, doc.autoTable.previous.finalY + 45, {
    align: "left",
  });

  console.log("Saving pdf");

  return doc;
}
