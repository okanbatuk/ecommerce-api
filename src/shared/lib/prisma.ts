import { PrismaClient } from "@prisma/client";
import { logger } from "../../config/logger";

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

(async () => {
  if (!global.__prisma) {
    try {
      await prisma.$connect();
      logger.info("Database connected");
    } catch (err) {
      logger.error(err, "Database connection failed");
      process.exit(1);
    }
  }
})();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
