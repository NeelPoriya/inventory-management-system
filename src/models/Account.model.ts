import { hashPassword } from "@/lib/helper";
import mongoose, { Model } from "mongoose";

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
AccountSchema.pre("save", function (next) {
  const account = this as any;
  if (!account.isModified("password")) {
    return next();
  }
  account.password = hashPassword(account.password);
  next();
});

let Account = Model<any>;
try {
  Account = mongoose.model("Account");
} catch (err) {
  Account = mongoose.model("Account", AccountSchema);
}

export default Account;
