import mongoose, { Model, Schema } from "mongoose";
import ProductVariant from "./ProductVariant.model";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
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

ProductSchema.pre("find", function () {
  this.populate("account_id");
});

ProductSchema.pre("findOneAndDelete", async function () {
  // delete all product variants having this product id
  const product_id = this.getQuery()["_id"];

  const ProductVariant = mongoose.model("ProductVariant");
  const productVariants = await ProductVariant.find({ product_id });
  const deletedProductVariants = await ProductVariant.deleteMany({
    product_id,
  });

  // delete all orders having this product variant id
  const Order = mongoose.model("Order");
  const deletedOrders = await Order.deleteMany({
    product_variant_id: { $in: productVariants },
  });
});

let Product = Model<any>;
try {
  Product = mongoose.model("Product");
} catch (err) {
  Product = mongoose.model("Product", ProductSchema);
}

export default Product;
