import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export async function connectDb() {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error(error, "Database connection failed");
    process.exit(1);
  }
}
