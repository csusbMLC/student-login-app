import Student from "../Models/StudentModel.js";
import { timeStamp, elapsedTime } from "../util/time.js";

/**
 * Retrieves a student by ID and returns the student object.
 * @function
 * @async
 * @param {Object} req - Express request object. The request query should contain the studentId.
 * @param {Object} res - Express response object. The function sends a JSON response with the student data.
 * @returns {void}
 */
export const getStudent = async (req, res) => {
  console.log(req.query);
  try {
    const student = await Student.findOne({ studentId: req.query.studentId });
    res.status(200).json(student);
  } catch (e) {
    console.log(e.message);
    res.status(404).send("Student not found");
  }
};

/**
 * Handles student login by updating lastLogin, lastClass, and adding a new loginTimestamp.
 * @function
 * @async
 * @param {Object} req - Express request object. The request body should contain the studentId and className.
 * @param {Object} res - Express response object. The function sends a JSON response with the updated student data.
 * @returns {void}
 */
export const loginStudent = async (req, res) => {
  const { studentId, className } = req.body;
  try {
    // console.log("student object", student);
    //set login time
    const loginTime = timeStamp();
    //update student login time
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: studentId },
      {
        lastLogin: loginTime,
        lastClass: className,
        $push: {
          loginTimestamps: {
            className: className,
            loginTime: loginTime,
            logoutTime: loginTime,
            totalTime: 0,
          },
        },
      },
      { new: true }
    );
    console.log("logged in student", {
      lastLogin: updatedStudent.lastLogin,
      lastClass: updatedStudent.lastClass,
      newTimestamp:
        updatedStudent.loginTimestamps[
          updatedStudent.loginTimestamps.length - 1
        ],
    });
    res.status(200).json(updatedStudent);
  } catch (e) {
    console.log(e.message);
    res.status(404).send("Student not found");
  }
};

/**
 * Handles student logout by updating lastLogout, calculating total time, and updating loginTimestamps.
 * @function
 * @async
 * @param {Object} req - Express request object. The request body should contain the studentId.
 * @param {Object} res - Express response object. The function sends a JSON response with the updated student data.
 * @returns {void}
 */
export const logoutStudent = async (req, res) => {
  const { studentId } = req.body;
  try {
    const student = await Student.findOne({ studentId: studentId });
    const index = student.loginTimestamps.findIndex(
      (timestamp) => timestamp.loginTime === student.lastLogin
    );
    if (index === -1) {
      throw new Error("Index not found");
    }
    const update = { $set: {} };
    const logoutTime = timeStamp();
    const totalTime = elapsedTime(
      student.loginTimestamps[index].loginTime,
      logoutTime
    );
    const filter = { studentId: student.studentId };

    update.$set[`loginTimestamps.${index}.logoutTime`] = logoutTime;
    update.$set[`loginTimestamps.${index}.totalTime`] = totalTime;
    update.$set["lastLogout"] = logoutTime;

    const updatedStudent = await Student.findOneAndUpdate(filter, update, {
      new: true,
    });

    console.log("logged out student", {
      timeStamp: updatedStudent.loginTimestamps[index],
      lastLogin: updatedStudent.lastLogin,
      lastLogout: updatedStudent.lastLogout,
    });
    res.status(200).json(updatedStudent);
  } catch (e) {
    console.log(e.message);
    res.status(404).send("Student not found");
  }
};

/**
 * Retrieves all students and returns an array of student objects.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object. The function sends a JSON response with an array of student data.
 * @returns {void}
 */
export const getStudents = async (req, res) => {
  let students = null;
  try {
    students = await Student.find({});
    res.status(200).json(students);
  } catch {
    res.status(404).json({ message: "Students not found" });
  }
};

/**
 * Creates a new student.
 * @function
 * @async
 * @param {Object} req - Express request object. The request body should contain the studentName, studentId, and classes.
 * @param {Object} res - Express response object. The function sends a JSON response with the created student data.
 * @returns {void}
 */
export const createStudent = async (req, res) => {
  const { studentName, studentId, classes } = req.body;
  console.log(studentName, studentId, classes);
  // look for student by studentId
  let studentExists = true;
  // check if student exists
  try {
    const findStudentRequest = await Student.findOne({ studentId });
    studentExists = findStudentRequest !== null;
    console.log(`Is ${studentId} new? `, !studentExists);
  } catch (e) {
    console.log(e.message);
  }
  // if student exists, return error
  if (studentExists) {
    return res
      .status(409)
      .json({ status: "Failure", message: "Student already exists" });
  }
  // if student does not exist, create student
  try {
    const student = await Student.create({ studentName, studentId, classes });
    res.status(201).json({ status: "Success", student });
  } catch {
    res.status(400).json({ status: "Failure", message: "Student not created" });
  }
};

/**
 * Deletes a student by ID.
 * @function
 * @async
 * @param {Object} req - Express request object. The request params should contain the studentId.
 * @param {Object} res - Express response object. The function sends a JSON response with the status of the operation.
 * @returns {void}
 */
export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log(studentId);
  try {
    const deleted = await Student.findOneAndDelete({ studentId });
    if (deleted) {
      res
        .status(200)
        .json({ status: "Success", message: "Student deleted", deleted });
    } else {
      res.status(404).json({ status: "Failure", message: "Student not found" });
    }
  } catch {
    res.status(400).json({ status: "Failure", message: "Student not deleted" });
  }
};

/**
 * Updates a student by ID.
 * @function
 * @async
 * @param {Object} req - Express request object. The request params should contain the studentId and the request body should contain the updated student data.
 * @param {Object} res - Express response object. The function sends a JSON response with the updated student data.
 * @returns {void}
 */
export const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const {
    studentName,
    classes,
    lastLogin,
    lastLogout,
    lastClass,
    loginTimestamps,
  } = req.body;
  console.log(studentId, studentName, classes);
  try {
    const updated = await Student.findOneAndUpdate(
      { studentId },
      {
        studentName,
        classes,
        lastLogin,
        lastLogout,
        lastClass,
        loginTimestamps,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ status: "Success", message: "Student updated", updated });
  } catch (e) {
    console.log("error", e.message);
    res.status(404).json({ status: "Failure", message: "Student not updated" });
  }
};
