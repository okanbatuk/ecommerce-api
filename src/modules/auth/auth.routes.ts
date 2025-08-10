import { FastifyInstance } from "fastify";
import { AuthController } from "./controllers/auth.controller";
import { loginJsonSchema, registerJsonSchema } from "./schemas";

export default async function authRoutes(fastify: FastifyInstance) {
  const authCtrl = new AuthController();

  fastify.post(
    "/register",
    {
      schema: {
        body: registerJsonSchema,
      },
    },
    authCtrl.register,
  );
  fastify.post(
    "/login",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: loginJsonSchema,
      },
    },
    authCtrl.login,
  );
  fastify.post("/refresh", authCtrl.refresh);
  fastify.post("/logout", authCtrl.logout);
}
