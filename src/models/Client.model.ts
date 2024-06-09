import mongoose, { Model, Schema } from "mongoose";

const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    registration_address: {
      type: String,
      default: "",
    },
    billing_address: {
      type: String,
      default: "",
    },
    gst_no: {
      type: String,
      default: "",
    },
    account_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    timestamps: true,
  }
);

ClientSchema.pre("find", function () {
  this.populate("account_id");
});

ClientSchema.pre("findOneAndDelete", function () {
  // delete all clients having this client id
  const client_id = this.getQuery()["_id"];

  const Order = mongoose.model("Order");
  // set client_id to null for all orders having this client_id
  Order.updateMany({ client_id }, { client_id: null })
    .then(() => {})
    .catch((err) => console.error("Error deleting Client", err));
});

let Client = Model<any>;

try {
  Client = mongoose.model("Client");
} catch (err) {
  Client = mongoose.model("Client", ClientSchema);
}

export default Client;
