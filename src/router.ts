import { Router } from "express";
import { createAccount, getUser, login } from "./handlers";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth.middleware";

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
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email")
    .isEmail()
    .withMessage("Se requiere un correo electrónico válido"),
  body("password").notEmpty().withMessage("La contraseña no puede estar vacía"),
  handleInputErrors,
  login
);

router.get("/user", authenticate, getUser);

export default router;
