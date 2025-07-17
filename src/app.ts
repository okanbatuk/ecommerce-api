import Fastify from "fastify";
import { registerCommonPlugins } from "./config/plugin";
import userRoutes from "./modules/user/routes/user.routes";
import errorHandlerPlugin from "./shared/plugins/error-handler.plugin";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await registerCommonPlugins(app);
  await app.register(errorHandlerPlugin);
  await app.register(userRoutes, { prefix: "/users" });

  return app;
}
