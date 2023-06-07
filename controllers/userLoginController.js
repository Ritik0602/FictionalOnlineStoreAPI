import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Password not matched" });
    }

    const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Error while logging in" });
  }
};
