import { Router } from "express";
import User from "./models/user.model";

const router = Router();

// Autentificacion y registro
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
});

export default router;
