import { FastifyInstance } from "fastify";
import {
  searchQueryJsonSchema,
  updatePasswordJsonSchema,
  updateUserJsonSchema,
  type UserSearchQueryType,
} from "./schemas";
import { container, TYPES } from "@/shared";
import { UserController } from "./controllers/user.controller";
import { idParamJsonSchema } from "@shared/validations/id-param.schema";

export default async function userRoutes(app: FastifyInstance) {
  const ctrl = container.get<UserController>(TYPES.UserController);

  app
    .addHook("preHandler", app.authenticate)
    .get<{ Querystring: UserSearchQueryType }>(
      "/",
      {
        preHandler: app.assertAdmin,
        schema: { querystring: searchQueryJsonSchema },
      },
      ctrl.search,
    )
    .get(
      "/:id",
      {
        preHandler: app.assertAdminOrSelf,
        schema: {
          params: idParamJsonSchema,
        },
      },
      ctrl.getById,
    )
    .put(
      "/:id",
      {
        preHandler: app.assertAdminOrSelf,
        schema: {
          params: idParamJsonSchema,
          body: updateUserJsonSchema,
        },
      },
      ctrl.update,
    )
    .put(
      "/:id/password",
      {
        preHandler: app.assertOwnUser,
        schema: {
          params: idParamJsonSchema,
          body: updatePasswordJsonSchema,
        },
      },
      ctrl.updatePassword,
    )
    .delete(
      "/:id",
      {
        preHandler: app.assertAdminOrSelf,
        schema: {
          params: idParamJsonSchema,
        },
      },
      ctrl.remove,
    );
}
