import type { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("El usuario ya existe");
      return res.status(409).json({ message: error.message });
    }

    const user = new User({ name, email, password });

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;

    await user.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
};
