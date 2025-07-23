import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { idParamJsonSchema } from "@shared/validations/id-param.schema";
import { updatePasswordJsonSchema, updateUserJsonSchema } from "../schemas";

export default async function userRoutes(fastify: FastifyInstance) {
  const userCtrl = new UserController();

  fastify.get("/", userCtrl.search);

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamJsonSchema,
      },
    },
    userCtrl.getById
  );

  fastify.put(
    "/:id",
    {
      schema: {
        params: idParamJsonSchema,
        body: updateUserJsonSchema,
      },
    },
    userCtrl.update
  );

  fastify.put(
    "/:id/password",
    {
      schema: {
        params: idParamJsonSchema,
        body: updatePasswordJsonSchema,
      },
    },
    userCtrl.updatePassword
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamJsonSchema,
      },
    },
    userCtrl.remove
  );
}
