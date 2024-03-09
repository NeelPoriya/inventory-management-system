import mongoose, { Model, Schema } from "mongoose";

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

let ProductVariant = Model<any>;
try {
  ProductVariant = mongoose.model("ProductVariant");
} catch (err) {
  ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
}

export default ProductVariant;
