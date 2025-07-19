import Fastify from "fastify";
import { registerRoutes } from "./config/routes.config";
import { registerCommonPlugins } from "./config/plugin";
import errorHandlerPlugin from "./shared/plugins/error-handler.plugin";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await registerCommonPlugins(app);
  await app.register(errorHandlerPlugin);
  await registerRoutes(app);

  return app;
}
