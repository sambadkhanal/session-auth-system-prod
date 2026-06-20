import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // Leading and trailing whitespaces will be removed before saving it to the mongodb
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: String,
  },
  { timestamps: true },
);

export default mongoose.model("User", schema);
