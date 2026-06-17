import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

export default mongoose.model("User", schema);
