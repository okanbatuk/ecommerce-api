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
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "10m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  redis: {
    host: process.env.REDIS_HOST! || "localhost",
    port: Number(process.env.REDIS_PORT!) || 6379,
    db: Number(process.env.REDIS_DB!) || 0,
  },
  cors: { origin: process.env.CORS_ORIGIN || true, credential: true },
};
