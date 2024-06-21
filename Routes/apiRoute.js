import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  loginStudent,
  logoutStudent,
  updateStudent,
} from "../Controllers/apiController.js";

const router = Router();

// grabs student by id and returns student object
router.get("/student", getStudent);
// TODO: fix route so that empty className requests are denied (currently allows for timestamp with no className)
// handles login by updating lastLogin and lastClass
router.post("/login", loginStudent);

// handles logout by updating lastLogout, then calculating total time and updating loginTimestamps
router.post("/logout", logoutStudent);

router.get("/students", getStudents);

router.post("/students", createStudent);

router.delete("/students/:studentId", deleteStudent);

router.put("/students/:studentId", updateStudent);

export default router;
