import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./router";
import connectDB from "./config/db";
import { corsOptions } from "./config/cors";

connectDB();

const app: express.Application = express();

// Configuracion de CORS
app.use(cors(corsOptions));

// leer datos el formularios
app.use(express.json());

//Routing
app.use("/api", router);

export default app;
