import mongoose, { Model, Schema } from "mongoose";
import ProductVariant from "./ProductVariant.model";

const OrderSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    product_variant_id: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
  },
  {
    timestamps: true,
  }
);

let Order = Model<any>;
try {
  Order = mongoose.model("Order");
} catch (error) {
  Order = mongoose.model("Order", OrderSchema);
}

export default Order;
