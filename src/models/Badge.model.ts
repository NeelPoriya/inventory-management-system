import mongoose, { Model, Schema } from "mongoose";

const BadgeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#000000",
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

BadgeSchema.pre("find", function () {
  this.populate("account_id");
});

BadgeSchema.pre("findOneAndDelete", function () {
  // delete all badges having this badge id
  const badge_id = this.getQuery()["_id"];

  const Order = mongoose.model("Order");
  // set badge_id to null for all orders having this badge_id
  Order.updateMany({ badge_id }, { badge_id: null })
    .then(() => {})
    .catch((err) => console.error("Error deleting Badge", err));
});

let Badge = Model<any>;
try {
  Badge = mongoose.model("Badge");
} catch (err) {
  Badge = mongoose.model("Badge", BadgeSchema);
}

export default Badge;
