import Admin from "../Models/AdminModel.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcryptjs";

/**
 * Controller function for admin signup.
 *
 * This function handles the signup process for an admin user. It checks if a user with the provided username already exists.
 * If the user exists, it sends a JSON response with a message indicating that the user already exists.
 * If the user does not exist, it creates a new user with the provided username and password, generates a secret token for the user, and sends a JSON response with a success message, the new user data, and the secret token.
 *
 * @function
 * @async
 * @param {Object} req - Express request object. The request body should contain the username and password for the new user.
 * @param {Object} res - Express response object. The function sends a JSON response with the signup status and, if successful, the new user data and the secret token.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 * @example
 * // usage
 * router.post("/signup", signup);
 */
export const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.json({
        success: false,
        message: `user with username ${username} already exists`,
      });
    }
    const newAdmin = await Admin.create({ username, password });
    const token = createSecretToken(newAdmin._id, username);

    res.status(201).json({
      message: "User signed in successfully",
      success: true,
      username,
      token,
    });
    next();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Controller function for admin login.
 *
 * This function handles the login process for an admin user. It checks if a user with the provided username exists and if the provided password matches the password of the existing user.
 * If the user exists and the password is correct, it generates a secret token for the user and sends a JSON response with a success message and the secret token.
 * If the user does not exist or the password is incorrect, it sends a JSON response with a failure message.
 *
 * @function
 * @async
 * @param {Object} req - Express request object. The request body should contain the username and password for the user.
 * @param {Object} res - Express response object. The function sends a JSON response with the login status and, if successful, the secret token.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 * @example
 * // usage
 * router.post("/login", login);
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({
        success: false,
        message: "Missing required fields username and/or password",
      });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.json({
        success: false,
        message: "Incorrect password or username",
      });
    }
    const auth = await bcrypt.compare(password, admin.password);
    if (!auth) {
      return res.json({
        success: false,
        message: "Incorrect password or username",
      });
    }
    const token = createSecretToken(admin._id);
    // console.log(token);
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      username,
      token,
    });
    next();
  } catch (err) {
    console.error(err);
  }
};
