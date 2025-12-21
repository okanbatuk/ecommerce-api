import { buildApp } from "./app";
import { config } from "./config/env.config";
import { logger } from "./config/logger";
import { prisma } from "./shared/lib/prisma";
import { redis } from "./shared/lib/redis";
import { registerShutdown } from "./shared/lib/shutdown";

(async () => {
  try {
    const app = await buildApp();
    app.addHook("onReady", async () => {
      await prisma.$connect();
      logger.info("Database connected");
    });

    registerShutdown({
      app,
      hooks: [
        {
          name: "prisma",
          handler: async () => prisma.$disconnect(),
        },
        {
          name: "redis",
          handler: async () => {
            await redis.quit();
          },
        },
      ],
      timeoutMs: 10_000,
    });

    await app.listen({ port: config.port, host: "0.0.0.0" });
    logger.info(`🚀 Fastify listening on port ${config.port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();
