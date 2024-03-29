import { Account } from "./Account";
import { Badge } from "./Badge";
import { Client } from "./Client";
import { ProductVariant } from "./ProductVariant";

export type Order = {
  _id: string;
  date: Date;
  product_variant_id: string;
  productvariant?: ProductVariant;
  badge_id: string;
  badge?: Badge;
  client_id: string;
  client?: Client;

  updatedAt: string;
  createdAt: string;

  quantity: number;
  account_id: string;
  account?: Account;

  type: "inward" | "outward";
  vehicle_no?: string;
  driver_name?: string;
  contact_number?: string;
  transporter?: string;
  mode_of_transport?: string;
  e_way_bill_no?: string;

  site_name?: string;
  contact_person?: string;
  contact_person_no?: string;
};

/*
const OrderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    product_variant_id: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    badge_id: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
    },
    account_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    // Transportation details
    vehicle_no: {
      type: String,
    },
    drive_name: {
      type: String,
    },
    contact_number: {
      type: String,
    },
    transporter: {
      type: String,
    },
    mode_of_transport: {
      type: String,
    },
    e_way_bill_no: {
      type: String,
      unique: true,
    },
    // site info
    site_name: {
      type: String,
      required: true,
    },
    contact_person: {
      type: String,
    },
    contact_person_no: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ["inward", "outward"],
    },
  },
  {
    timestamps: true,
  }
);
*/
