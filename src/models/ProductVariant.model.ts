import mongoose, { Model, Schema } from "mongoose";
import Product from "./Product.model";
import Account from "./Account.model";

const ProductVariantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
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

ProductVariantSchema.pre("find", function () {
  this.populate("product_id");
  this.populate("account_id");
});

ProductVariantSchema.pre("findOneAndDelete", function () {
  console.log("pre findOneAndDelete for ProductVariant");
  // delete all product variants having this product variant id
  const product_variant_id = this.getQuery()["_id"];
  const Order = mongoose.model("Order");
  // delete all orders having this product variant id
  Order.deleteMany({ product_variant_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting Order", err));
});

let ProductVariant = Model<any>;
try {
  ProductVariant = mongoose.model("ProductVariant");
} catch (err) {
  ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
}

export default ProductVariant;
