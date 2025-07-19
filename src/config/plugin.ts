import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { config } from "./env.config";
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

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify API",
        description: "Fastify API documentation",
        version: "0.1.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: false },
  });
}
