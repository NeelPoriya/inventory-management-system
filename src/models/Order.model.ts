import mongoose, { Model, Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    product_variant_id: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    badge_id: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
    },
    account_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    // Transportation details
    vehicle_no: {
      type: String,
    },
    driver_name: {
      type: String,
    },
    contact_number: {
      type: String,
    },
    transporter: {
      type: String,
    },
    mode_of_transport: {
      type: String,
    },
    e_way_bill_no: {
      type: String,
    },
    // site info
    site_name: {
      type: String,
      // required: true,
    },
    contact_person: {
      type: String,
    },
    contact_person_no: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ["inward", "outward"],
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("find", function () {
  // populate all fields
  this.populate("product_variant_id");
  this.populate("client_id");
  this.populate("badge_id");
  this.populate("account_id");
});

let Order = Model<any>;
try {
  Order = mongoose.model("Order");
} catch (error) {
  Order = mongoose.model("Order", OrderSchema);
}

export default Order;
