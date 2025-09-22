import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL || ""];

    if (allowedOrigins.includes(origin || "")) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};
