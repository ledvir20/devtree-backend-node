import type { Request, Response } from "express";
import User from "../models/user.model";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
};
