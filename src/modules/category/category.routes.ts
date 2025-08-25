import { FastifyInstance } from "fastify";
import {
  container,
  idParamJsonSchema,
  slugParamJsonSchema,
  TYPES,
} from "@/shared";
import {
  type AddCategoryInput,
  addCategoryJsonSchema,
  categorySearchJsonSchema,
} from "./schemas";
import { CategoryController } from "./controllers/category.controller";

const categoryRoutes = (fastify: FastifyInstance) => {
  const ctrl = container.get<CategoryController>(TYPES.CategoryController);

  fastify
    .addHook("preHandler", fastify.authenticate)
    .get(
      "/",
      { schema: { querystring: categorySearchJsonSchema } },
      ctrl.search,
    )
    .get(
      "/id/:id",
      { schema: { querystring: idParamJsonSchema } },
      ctrl.getById,
    )
    .get(
      "/slug/:slug",
      { schema: { params: slugParamJsonSchema } },
      ctrl.getBySlug,
    )
    .post<{ Body: AddCategoryInput }>(
      "/",
      {
        preHandler: fastify.assertAdmin,
        schema: { body: addCategoryJsonSchema },
      },
      ctrl.create,
    );
};
