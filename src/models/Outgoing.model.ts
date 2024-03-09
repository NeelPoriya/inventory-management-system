import mongoose, { Model, Schema } from "mongoose";
import Badge from "@/models/Badge.model";
import Client from "@/models/Client.model";
import ProductVariant from "@/models/ProductVariant.model";
import Order from "./Order.model";

const OutgoingSchema = new Schema(
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

let Outgoing = Model<any>;
try {
  Outgoing = mongoose.model("Outgoing");
} catch (err) {
  Outgoing = mongoose.model("Outgoing", OutgoingSchema);
}

export default Outgoing;
