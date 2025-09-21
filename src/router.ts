import { Router } from "express";
import { createAccount } from "./handlers";
import { body } from "express-validator";

const router: Router = Router();

// Autentificacion y registro
router.post(
  "/auth/register",
  body("handle").isString().notEmpty().withMessage("El handle es obligatorio"),
  body("name").isString().notEmpty().withMessage("El nombre es obligatorio"),
  body("email")
    .isEmail()
    .withMessage("Se requiere un correo electrónico válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  createAccount
);

export default router;
