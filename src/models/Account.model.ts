import { hashPassword } from "@/lib/helper";
import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// A pipeline to hash the password before saving the account
AccountSchema.pre("save", function (next: any) {
  const account = this as any;
  if (!account.isModified("password")) {
    return next();
  }
  account.password = hashPassword(account.password);
  next();
});

AccountSchema.pre("find", function () {
  this.select("-password");
});

AccountSchema.pre("findOneAndDelete", function () {
  // delete all products, product variants, badges, clients, incoming and outgoing having this account id
  const account_id = this.getQuery()["_id"];
  const Product = mongoose.model("Product");
  const ProductVariant = mongoose.model("ProductVariant");
  const Badge = mongoose.model("Badge");
  const Client = mongoose.model("Client");
  const Incoming = mongoose.model("Incoming");
  const Outgoing = mongoose.model("Outgoing");

  Product.deleteMany({ account_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting Product", err));
  ProductVariant.deleteMany({ account_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting ProductVariant", err));
  Badge.deleteMany({ account_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting Badge", err));
  Client.deleteMany({ account_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting Client", err));
  Incoming.deleteMany({ account_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting Incoming", err));
  Outgoing.deleteMany({ account_id })
    .then(() => {})
    .catch((err) => console.error("Error deleting Outgoing", err));
});

let Account = mongoose.Model<any>;
try {
  Account = mongoose.model("Account");
} catch (err) {
  Account = mongoose.model("Account", AccountSchema);
}

export default Account;
