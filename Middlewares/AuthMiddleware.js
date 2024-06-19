import AdminModel from "../Models/AdminModel.js";
import { config } from "dotenv";

import jwt from "jsonwebtoken";

config();

export const userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const admin = await AdminModel.findById(data.id);
      if (admin) return res.json({ status: true, admin: admin.username });
      else return res.json({ status: false });
    }
  });
};
