import { Router } from "express";
import {
  createStudent,
  deleteAllStudents,
  deleteStudent,
  getStudent,
  getStudents,
  loginStudent,
  logoutStudent,
  updateStudent,
} from "../Controllers/apiController.js";
import { authorize } from "../Middlewares/AuthMiddleware.js";

const router = Router();

/**
 * Retrieves a student by ID and returns the student object.
 * @route GET /student
 */
router.get("/student", getStudent);

/**
 * Handles student login by updating lastLogin and lastClass.
 * @route POST /login
 * @todo Fix route so that empty className requests are denied (currently allows for timestamp without className)
 */
router.post("/login", loginStudent);

/**
 * Handles student logout by updating lastLogout, calculating total time, and updating loginTimestamps.
 * @route POST /logout
 */
router.post("/logout", logoutStudent);

/**
 * Retrieves all students.
 * @route GET /students
 */
router.get("/students", getStudents);

/**
 * Creates a new student.
 * @route POST /students
 */
router.post("/students", createStudent);

/**
 * Deletes a student by ID.
 * @route DELETE /students/:studentId
 */
router.delete("/students/:studentId", deleteStudent);

/**
 * Updates a student by ID.
 * @route PUT /students/:studentId
 */
router.put("/students/:studentId", updateStudent);

/**
 * Deletes all students.
 * @route DELETE /students
 */
router.delete("/students", authorize, deleteAllStudents);

export default router;
