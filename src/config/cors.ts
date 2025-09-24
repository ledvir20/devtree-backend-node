import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const whitelistedOrigins = [process.env.FRONTEND_URL || ""];

    if (process.argv.at(-1) === "--api") {
      whitelistedOrigins.push("");
    }

    if (whitelistedOrigins.includes(origin || "")) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};
