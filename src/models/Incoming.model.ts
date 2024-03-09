import mongoose, { Model, Schema } from "mongoose";
import Badge from "@/models/Badge.model";
import Client from "@/models/Client.model";
import ProductVariant from "@/models/ProductVariant.model";
import Order from "./Order.model";

const IncomingSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    badge_id: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
    },
  },
  {
    timestamps: true,
  }
);

let Incoming = Model<any>;
try {
  Incoming = mongoose.model("Incoming");
} catch (err) {
  Incoming = mongoose.model("Incoming", IncomingSchema);
}

export default Incoming;
