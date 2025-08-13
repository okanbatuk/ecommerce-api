import Fastify from "fastify";
import { registerRoutes, registerCommonPlugins } from "./config";
import decoratorPlugin from "./config/context";
import disableValidator from "./config/disable-validator.config";
import errorHandlerPlugin from "./shared/plugins/error-handler.plugin";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await disableValidator(app);
  await registerCommonPlugins(app);
  await app.register(decoratorPlugin);
  await app.register(errorHandlerPlugin);
  await registerRoutes(app);

  return app;
}
