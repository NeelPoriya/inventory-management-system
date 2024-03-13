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

let ProductVariant = Model<any>;
try {
  ProductVariant = mongoose.model("ProductVariant");
} catch (err) {
  ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
}

export default ProductVariant;
