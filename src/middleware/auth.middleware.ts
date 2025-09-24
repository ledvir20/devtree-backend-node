import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Middleware para autenticar solicitudes usando JWT.
 *
 * Verifica que el encabezado de autorización contenga un token Bearer válido,
 * valida el token usando la clave secreta definida en el entorno (`JWT_SECRET`),
 * y adjunta el usuario autenticado al objeto `req` si el token es válido.
 *
 * Responde con errores apropiados si:
 * - El encabezado de autorización no está presente o es inválido.
 * - El token está ausente, inválido o expirado.
 * - La clave secreta no está configurada.
 * - El usuario no existe en la base de datos.
 *
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para pasar al siguiente middleware.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res
        .status(500)
        .json({ message: "JWT_SECRET no está configurado en el entorno." });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch {
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    const userId = payload?.id;
    if (!userId) {
      return res.status(401).json({ message: "Token inválido." });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Adjunta el usuario al objeto req para uso posterior
    req.user = user;
    next();
  } catch {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
