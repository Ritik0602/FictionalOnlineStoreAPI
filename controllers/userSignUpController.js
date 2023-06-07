import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../model/user.js";

dotenv.config();

export const signUp = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const isUser = await User.findOne({ username });
    if (isUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashed_password = await bcrypt.hash(password, 12);
    const user = {
      name,
      email,
      username,
      password: hashed_password,
    };

    const newUser = new User(user);
    await newUser.save();

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Error while signing up" });
  }
};
