import { TYPES } from "@/shared";
import { container } from "@/shared/container";
import { intIdParamJsonSchema } from "@/shared/schemas/int-id-param";
import { slugParamJsonSchema } from "@/shared/schemas/slug-param";
import { FastifyInstance } from "fastify";
import { CategoryController } from "./controller";
import {
  addCategoryJsonSchema,
  type AddCategoryInput,
} from "./schemas/add-input";
import { categorySearchJsonSchema } from "./schemas/search-input";
import { UpdateCategoryInput } from "./schemas/update-input";

const categoryRoutes = (fastify: FastifyInstance) => {
  const ctrl = container.get<CategoryController>(TYPES.CategoryController);

  // Public routes
  fastify
    .addHook("preHandler", fastify.optionalAuth)
    .get(
      "/",
      { schema: { querystring: categorySearchJsonSchema } },
      ctrl.search,
    )
    .get("/id/:id", { schema: { params: intIdParamJsonSchema } }, ctrl.getById)
    .get(
      "/slug/:slug",
      { schema: { params: slugParamJsonSchema } },
      ctrl.getBySlug,
    );

  fastify.register(async (protectedRoutes) => {
    protectedRoutes
      .addHook("preHandler", fastify.authenticate)
      .post<{ Body: AddCategoryInput }>(
        "/",
        {
          preHandler: fastify.assertAdmin,
          schema: { body: addCategoryJsonSchema },
        },
        ctrl.create,
      )
      .put<{ Params: { id: string }; Body: UpdateCategoryInput }>(
        "/:id",
        {
          preHandler: fastify.assertAdmin,
          schema: { params: intIdParamJsonSchema },
        },
        ctrl.update,
      )
      .patch<{ Params: { id: string } }>(
        "/:id/restore",
        {
          preHandler: fastify.assertAdmin,
          schema: { params: intIdParamJsonSchema },
        },
        ctrl.restore,
      )
      .delete<{ Params: { id: string } }>(
        "/:id",
        {
          preHandler: fastify.assertAdmin,
          schema: { params: intIdParamJsonSchema },
        },
        ctrl.delete,
      );
  });
};

export default categoryRoutes;
