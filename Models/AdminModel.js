import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * @typedef {import("mongoose").Schema} MongooseSchema
 * @typedef {import("mongoose").Model} MongooseModel
 */

/**
 * @typedef {Object} Admin
 * @property {string} username - The username of the admin.
 * @property {string} password - The password of the admin.
 */

/** @type {MongooseSchema} */
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

/** @type {MongooseModel<Admin>} */
export default model("Admin", adminSchema);
