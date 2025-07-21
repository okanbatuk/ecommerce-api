import { FastifyInstance } from "fastify";
import { loginJsonSchema } from "../schemas/login.schema";
import { createUserJsonSchema } from "@modules/user/schemas";
import { AuthController } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  const authCtrl = new AuthController();

  fastify.post(
    "/register",
    { schema: { body: createUserJsonSchema } },
    authCtrl.register
  );
  fastify.post(
    "/login",
    {
      schema: {
        body: loginJsonSchema,
      },
    },
    authCtrl.login
  );
  fastify.post("/refresh", authCtrl.refresh);
  fastify.post("/logout", authCtrl.logout);
}
