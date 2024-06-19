import { login, signup } from "../Controllers/AuthController.js";
import { Router } from "express";
import { userVerification } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.post("/", userVerification);

router.post("/signup", signup);

router.post("/login", login);

export default router;
