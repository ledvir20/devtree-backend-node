import type { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/auth";
import slug from "slug";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("El usuario con ese email ya existe");
      return res.status(409).json({ message: error.message });
    }

    const handle = slug(req.body.handle, "");
    const handleExists = await User.findOne({ handle });

    if (handleExists) {
      const error = new Error("El handle ya existe");
      return res.status(409).json({ message: error.message });
    }

    const user = new User({ name, email, password });

    user.password = await hashPassword(password);
    user.handle = handle;

    await user.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
};
