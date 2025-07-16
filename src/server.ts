import { buildApp } from "./app";
import { config } from "./config/env";

(async () => {
  const app = await buildApp();
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`🚀 Fastify listening on port ${config.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
