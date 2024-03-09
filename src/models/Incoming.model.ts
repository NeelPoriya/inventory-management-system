import mongoose, { Model, Schema } from "mongoose";
const IncomingSchema = new Schema(
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

let Incoming = Model<any>;
try {
  Incoming = mongoose.model("Incoming");
} catch (err) {
  Incoming = mongoose.model("Incoming", IncomingSchema);
}

export default Incoming;
