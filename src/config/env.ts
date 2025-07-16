import dotenv from "dotenv-safe";
dotenv.config({
  allowEmptyValues: true,
});

export const config = {
  port: Number(process.env.PORT!) || 5000,
  db: { url: process.env.DATABASE_URL! },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: "10m",
    refreshExpiresIn: "7d",
  },
  bcrypt: { saltRounds: 10 },
  cors: { origin: process.env.CORS_ORIGIN || true, credential: true },
};
