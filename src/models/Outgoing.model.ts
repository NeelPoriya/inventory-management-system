import mongoose, { Model, Schema } from "mongoose";

const OutgoingSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
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

let Outgoing = Model<any>;
try {
  Outgoing = mongoose.model("Outgoing");
} catch (err) {
  Outgoing = mongoose.model("Outgoing", OutgoingSchema);
}

export default Outgoing;
