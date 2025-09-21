import express from "express";
import "dotenv/config";
import router from "./router";
import connectDB from "./config/db";

const app: express.Application = express();

connectDB();

// leer datos el formularios
app.use(express.json());

//Routing
app.use("/api", router);

export default app;
