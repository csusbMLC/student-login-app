import { Schema, model } from "mongoose";

const StudentSchema = new Schema({
  studentName: String,
  studentId: String,
  classes: [String],
  lastLogin: Number,
  lastLogout: Number,
  lastClass: String,
  loginTimestamps: [
    {
      className: String,
      loginTime: Number,
      logoutTime: Number,
      totalTime: Number,
    },
  ],
});

export default model("Student", StudentSchema);
