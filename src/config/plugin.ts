import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { config } from "./env";

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
}
