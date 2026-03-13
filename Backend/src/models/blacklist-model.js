import mongoose, { Schema } from "mongoose";

const blackListSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "token is required to be added in blacklist"],
    },
  },
  { timestamps: true },
);

const tokenBlackListModel = mongoose.model("blackListTokens", blackListSchema);

export { tokenBlackListModel };
