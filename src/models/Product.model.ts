import mongoose, { Model, Schema } from "mongoose";

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

let Product = Model<any>;
try {
  Product = mongoose.model("Product");
} catch (err) {
  Product = mongoose.model("Product", ProductSchema);
}

export default Product;
