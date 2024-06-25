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
  try {
    const student = await Student.findOne({ studentId: req.query.studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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
    const loginTime = timeStamp();
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId },
      {
        lastLogin: loginTime,
        lastClass: className,
        $push: {
          loginTimestamps: {
            className,
            loginTime,
            logoutTime: loginTime,
            totalTime: 0,
          },
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const index = student.loginTimestamps.findIndex(
      (timestamp) => timestamp.loginTime === student.lastLogin
    );
    if (index === -1) {
      return res.status(404).json({ message: "Login session not found" });
    }

    const logoutTime = timeStamp();
    const totalTime = elapsedTime(
      student.loginTimestamps[index].loginTime,
      logoutTime
    );

    student.loginTimestamps[index].logoutTime = logoutTime;
    student.loginTimestamps[index].totalTime = totalTime;
    student.lastLogout = logoutTime;

    await student.save();

    res.status(200).json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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
  try {
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const student = await Student.create({ studentName, studentId, classes });
    res.status(201).json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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
  try {
    const deleted = await Student.findOneAndDelete({ studentId });
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted", deleted });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
