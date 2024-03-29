import mongoose, { Model, Schema } from "mongoose";

const OutgoingSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
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
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OutgoingSchema.pre("find", function () {
  this.populate("product_variant_id");
  this.populate("client_id");
  this.populate("badge_id");
  this.populate("account_id");
});

/**
 * @deprecated Use Order Instead
 */
let Outgoing = Model<any>;
try {
  Outgoing = mongoose.model("Outgoing");
} catch (err) {
  Outgoing = mongoose.model("Outgoing", OutgoingSchema);
}

export default Outgoing;
