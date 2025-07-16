import Fastify from "fastify";
import { config } from "./config/env";
import { connectDb } from "./config/database";
import { registerCommonPlugins } from "./config/plugin";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await connectDb();
  await registerCommonPlugins(app);

  return app;
}
