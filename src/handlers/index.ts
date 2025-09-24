import type { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/auth";
import slug from "slug";
import { validationResult } from "express-validator";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {
  try {
    // Validaciones (puedes descomentar si usas express-validator)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Ya existe una cuenta registrada con este correo electrónico.",
      });
    }

    const handle = slug(req.body.handle, "");
    const handleExists = await User.findOne({ handle });

    if (handleExists) {
      return res.status(409).json({
        message:
          "El nombre de usuario (handle) ya está en uso. Por favor, elige otro.",
      });
    }

    const user = new User({ name, email, password });

    user.password = await hashPassword(password);
    user.handle = handle;

    await user.save();

    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    res.status(400).json({
      message:
        "No se pudo registrar el usuario. Por favor, intenta nuevamente.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "No se encontró una cuenta con ese correo electrónico.",
      });
    }

    // Comparar contraseñas
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "La contraseña ingresada es incorrecta." });
    }
    // Aquí podrías generar un token JWT y enviarlo en la respuesta
    const token = generateJWT({ id: user._id, email: user.email });

    res.status(200).json({ message: "Inicio de sesión exitoso.", token });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ocurrió un error al intentar iniciar sesión." });
  }
};
