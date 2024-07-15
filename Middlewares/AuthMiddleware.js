import AdminModel from "../Models/AdminModel.js";
import { config } from "dotenv";

import jwt from "jsonwebtoken";

config();
/**
 * Middleware function for user verification.
 *
 * This function verifies the JWT token passed in the authorization header of the request.
 * If the token is valid and corresponds to an existing admin user, it returns a JSON response with the status set to true and the username of the admin.
 * If the token is invalid or does not correspond to an existing admin user, it returns a JSON response with the status set to false.
 *
 * @function
 * @param {Object} req - Express request object. The JWT token should be included in the authorization header.
 * @param {Object} res - Express response object. The function sends a JSON response with the verification status and, if successful, the username of the admin.
 * @returns {void}
 * @example
 * // usage
 * router.post("/", userVerification);
 */
export const userVerification = (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const admin = await AdminModel.findById(data.id);
      if (admin) return res.json({ status: true, username: admin.username });
      else return res.json({ status: false });
    }
  });
};

export const authorize = (req, res, next) => {
  console.log("authorize called");
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const admin = await AdminModel.findById(data.id);
      if (admin) {
        console.log("authorized admin, calling next");
        next();
      } else return res.json({ status: false });
    }
  });
};
