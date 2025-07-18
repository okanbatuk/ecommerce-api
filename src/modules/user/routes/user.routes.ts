import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { createUserJsonSchema, updateUserJsonSchema } from "../schemas";
import { idParamJsonSchema } from "../../../shared/validations/id-param.schema";

export default async function userRoutes(fastify: FastifyInstance) {
  const ctrl = new UserController();

  fastify.get("/", ctrl.search);

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamJsonSchema,
      },
    },
    ctrl.getById
  );

  fastify.post("/", ctrl.create);

  fastify.patch(
    "/:id",
    {
      schema: {
        params: idParamJsonSchema,
      },
    },
    ctrl.update
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamJsonSchema,
      },
    },
    ctrl.remove
  );
}
