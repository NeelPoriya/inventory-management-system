import mongoose, { Model, Schema } from "mongoose";
import Account from "./Account.model";

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
    account_id: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  },
  {
    timestamps: true,
  }
);

let Client = Model<any>;

try {
  Client = mongoose.model("Client");
} catch (err) {
  Client = mongoose.model("Client", ClientSchema);
}

export default Client;
