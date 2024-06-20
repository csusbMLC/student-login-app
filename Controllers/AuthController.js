import Admin from "../Models/AdminModel.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.json({
        message: `user with username ${username} already exists`,
      });
    }
    const newAdmin = await Admin.create({ username, password });
    const token = createSecretToken(newAdmin._id);
    // res.cookie("token", token, {
    //   httpOnly: false,
    // });
    res.status(201).json({
      message: "User signed in successfully",
      success: true,
      newAdmin,
      token,
    });
    next();
  } catch (err) {
    console.error(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({
        message: "Missing required fields username and/or password",
      });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.json({ message: "Incorrect password or username" });
    }
    const auth = await bcrypt.compare(password, admin.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or username" });
    }
    const token = createSecretToken(admin._id);
    // console.log(token);
    // res.cookie("token", token, { httpOnly: false });
    // res.cookie("cart", "test", { maxAge: 900000, httpOnly: true });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true, token });
    next();
  } catch (err) {
    console.error(err);
  }
};
