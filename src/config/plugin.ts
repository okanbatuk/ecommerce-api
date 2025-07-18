import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { FastifyInstance } from "fastify";
import { config } from "./env";
import validationHooks from "../shared/plugins/validation-hooks";

export async function registerCommonPlugins(app: FastifyInstance) {
  await app.register(cors, {
    origin: "*",
    credentials: true,
  });
  await app.register(helmet);
  await app.register(fastifyCookie, {
    secret: config.jwt.refreshSecret,
  });
  await app.register(fastifyJwt, {
    secret: config.jwt.accessSecret,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
  });
  await app.register(validationHooks);
}
