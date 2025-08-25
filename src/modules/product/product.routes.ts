import { FastifyInstance } from "fastify";
import {
  type AddProductInput,
  type UpdateProductInput,
  addProductJsonSchema,
  searchQueryJsonSchema,
  updateProductJsonSchema,
} from "./schemas";
import { container, slugParamJsonSchema, TYPES } from "@/shared";
import {
  type idParamType,
  idParamJsonSchema,
} from "@/shared/schemas/id-param.schema";
import { ProductController } from "./controllers/product.controller";

const productRoutes = (fastify: FastifyInstance) => {
  const ctrl = container.get<ProductController>(TYPES.ProductController);

  fastify
    .addHook("preHandler", fastify.authenticate)
    .get("/", { schema: { querystring: searchQueryJsonSchema } }, ctrl.search)
    .get("/id/:id", { schema: { params: idParamJsonSchema } }, ctrl.getById)
    .get(
      "/slug/:slug",
      { schema: { params: slugParamJsonSchema } },
      ctrl.getBySlug,
    )
    .post<{ Body: AddProductInput }>(
      "/",
      {
        preHandler: fastify.assertAdmin,
        schema: { body: addProductJsonSchema },
      },
      ctrl.create,
    )
    .patch<{ Params: idParamType; Body: UpdateProductInput }>(
      "/:id",
      {
        preHandler: fastify.assertAdmin,
        schema: {
          params: idParamJsonSchema,
          body: updateProductJsonSchema,
        },
      },
      ctrl.update,
    )
    .patch<{ Params: idParamType }>(
      "/:id/restore",
      {
        preHandler: fastify.assertAdmin,
        schema: {
          params: idParamJsonSchema,
        },
      },
      ctrl.restore,
    )
    .delete<{ Params: { id: string } }>(
      "/:id",
      {
        preHandler: fastify.assertAdmin,
        schema: { params: idParamJsonSchema },
      },
      ctrl.delete,
    );
};

export default productRoutes;
