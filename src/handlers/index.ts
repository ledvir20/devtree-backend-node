import type { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/auth";
import slug from "slug";
import { validationResult } from "express-validator";

export const createAccount = async (req: Request, res: Response) => {
  try {
    // Manejo de errores y validaciones
    // let errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

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

    res.status(201).send("Usuario registrado con éxito");
  } catch (error) {
    res.status(400).send("Error al registrar usuario");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("El usuario no existe");
      return res.status(401).json({ message: error.message });
    }

    // Comparar contraseñas
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Credenciales inválidas");
      return res.status(401).json({ message: error.message });
    }

    res.status(200).send("Login successful");
  } catch (error) {
    res.status(400).send("Error logging in");
  }
};
