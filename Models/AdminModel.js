import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new Schema({
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
});

adminSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

export default model("Admin", adminSchema);
