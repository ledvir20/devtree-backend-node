import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "180d",
  });

  return token;
};
