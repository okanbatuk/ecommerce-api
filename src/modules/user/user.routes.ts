import { FastifyInstance } from "fastify";
import {
  searchQueryJsonSchema,
  updatePasswordJsonSchema,
  updateUserJsonSchema,
  userSearchQueryType,
} from "./schemas";
import { UserController } from "./controllers/user.controller";
import { idParamJsonSchema } from "@shared/validations/id-param.schema";

export default async function userRoutes(fastify: FastifyInstance) {
  const userCtrl = new UserController();

  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get<{ Querystring: userSearchQueryType }>(
    "/",
    {
      preHandler: fastify.assertAdmin,
      schema: { querystring: searchQueryJsonSchema },
    },
    userCtrl.search,
  );

  fastify.get(
    "/:id",
    {
      preHandler: fastify.assertAdminOrSelf,
      schema: {
        params: idParamJsonSchema,
      },
    },
    userCtrl.getById,
  );

  fastify.put(
    "/:id",
    {
      preHandler: fastify.assertAdminOrSelf,
      schema: {
        params: idParamJsonSchema,
        body: updateUserJsonSchema,
      },
    },
    userCtrl.update,
  );

  fastify.put(
    "/:id/password",
    {
      preHandler: fastify.assertOwnUser,
      schema: {
        params: idParamJsonSchema,
        body: updatePasswordJsonSchema,
      },
    },
    userCtrl.updatePassword,
  );

  fastify.delete(
    "/:id",
    {
      preHandler: fastify.assertAdminOrSelf,
      schema: {
        params: idParamJsonSchema,
      },
    },
    userCtrl.remove,
  );
}
