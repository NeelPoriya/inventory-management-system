import mongoose, { Model, Schema } from "mongoose";

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
    account_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("find", function () {
  this.populate("product_variant_id");
  this.populate("account_id");
});

let Order = Model<any>;
try {
  Order = mongoose.model("Order");
} catch (error) {
  Order = mongoose.model("Order", OrderSchema);
}

export default Order;
