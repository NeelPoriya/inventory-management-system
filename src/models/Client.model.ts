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

let Client = Model<any>;

try {
  Client = mongoose.model("Client");
} catch (err) {
  Client = mongoose.model("Client", ClientSchema);
}

export default Client;
