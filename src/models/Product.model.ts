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

ProductSchema.pre("findOneAndDelete", function () {
  // delete all product variants having this product id
  const product_id = this.getQuery()["_id"];
  ProductVariant.deleteMany({ product_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting ProductVariant", err));
});

let Product = Model<any>;
try {
  Product = mongoose.model("Product");
} catch (err) {
  Product = mongoose.model("Product", ProductSchema);
}

export default Product;
