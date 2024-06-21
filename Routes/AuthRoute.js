import { login, signup } from "../Controllers/AuthController.js";
import { Router } from "express";
import { userVerification } from "../Middlewares/AuthMiddleware.js";

/**
 * Express router for handling authentication routes.
 * @module AuthRoute
 */

const router = Router();

/**
 * Route for user verification.
 * @name POST /
 * @function
 * @memberof module:AuthRoute
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.post("/", userVerification);

/**
 * Route for user signup.
 * @name POST /signup
 * @function
 * @memberof module:AuthRoute
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post("/signup", signup);

/**
 * Route for user login.
 * @name POST /login
 * @function
 * @memberof module:AuthRoute
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post("/login", login);

export default router;
