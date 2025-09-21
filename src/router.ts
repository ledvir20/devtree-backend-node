import { Router } from "express";

const router = Router();

// Autentificacion y registro
router.post("/auth/register", (req, res) => {
  res.send("Welcome to the Registration Page!");
});

export default router;
