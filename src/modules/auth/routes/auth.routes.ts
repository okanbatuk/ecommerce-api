import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { createUserJsonSchema } from "../../user/schemas";
import { loginJsonSchema } from "../schemas/login.schema";

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
  fastify.post("/logout", authCtrl.logout);
}
