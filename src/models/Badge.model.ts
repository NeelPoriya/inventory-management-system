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

let Badge = Model<any>;
try {
  Badge = mongoose.model("Badge");
} catch (err) {
  Badge = mongoose.model("Badge", BadgeSchema);
}

export default Badge;
