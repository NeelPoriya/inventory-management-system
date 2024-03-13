import mongoose, { Model, Schema } from "mongoose";
const IncomingSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

IncomingSchema.pre("find", function () {
  this.populate("client_id");
  this.populate("badge_id");
  // this.populate("account_id");
});

let Incoming = Model<any>;
try {
  Incoming = mongoose.model("Incoming");
} catch (err) {
  Incoming = mongoose.model("Incoming", IncomingSchema);
}

export default Incoming;
