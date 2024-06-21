import { Schema, model } from "mongoose";

/**
 * Represents a student in the system.
 * @typedef {Object} Student
 * @property {string} studentName - The name of the student.
 * @property {string} studentId - The ID of the student.
 * @property {string[]} classes - The classes the student is enrolled in.
 * @property {number} lastLogin - The timestamp of the student's last login.
 * @property {number} lastLogout - The timestamp of the student's last logout.
 * @property {string} lastClass - The name of the last class the student attended.
 * @property {LoginTimestamp[]} loginTimestamps - The login timestamps for each class.
 */

/**
 * Represents a login timestamp for a class.
 * @typedef {Object} LoginTimestamp
 * @property {string} className - The name of the class.
 * @property {number} loginTime - The timestamp of the login.
 * @property {number} logoutTime - The timestamp of the logout.
 * @property {number} totalTime - The total time spent in the class.
 */

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
