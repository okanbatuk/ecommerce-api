import type { FastifyInstance } from "fastify";
import { logger } from "@/config";

export type ShutdownHook = {
  name: string;
  handler: () => Promise<void>;
};

type GracefulShutdownOptions = {
  app: FastifyInstance;
  hooks?: ShutdownHook[];
  timeoutMs?: number;
};

export function registerShutdown({
  app,
  hooks = [],
  timeoutMs = 10_000,
}: GracefulShutdownOptions) {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down gracefully...");

    const timer = setTimeout(() => {
      logger.error("Forced shutdown (timeout exceeded)");
      process.exit(1);
    }, timeoutMs);

    try {
      await app.close();
      logger.info("Fastify server closed");

      // run hooks sequentially (safe)
      for (const hook of hooks) {
        try {
          logger.info(`Closing: ${hook.name}`);
          await hook.handler();
          logger.info(`Closed: ${hook.name}`);
        } catch (err) {
          logger.error(err, `Failed to close: ${hook.name}`);
        }
      }

      clearTimeout(timer);
      process.exit(0);
    } catch (err) {
      logger.error(err, "Graceful shutdown failed");
      process.exit(1);
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
  process.on("uncaughtException", shutdown);
  process.on("unhandledRejection", shutdown);
}
