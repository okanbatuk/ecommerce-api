import { FastifyInstance } from "fastify";
import { container, TYPES } from "@/shared";
import { AuthController } from "./controllers/auth.controller";
import { loginJsonSchema, registerJsonSchema } from "./schemas";

export default async function authRoutes(fastify: FastifyInstance) {
  const ctrl = container.get<AuthController>(TYPES.AuthController);

  fastify
    .post(
      "/register",
      {
        schema: {
          body: registerJsonSchema,
        },
      },
      ctrl.register,
    )
    .post(
      "/login",
      {
        schema: {
          security: [{ bearerAuth: [] }],
          body: loginJsonSchema,
        },
      },
      ctrl.login,
    )
    .post("/refresh", ctrl.refresh)
    .post("/logout", ctrl.logout);
}
