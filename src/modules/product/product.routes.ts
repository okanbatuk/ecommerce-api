import { FastifyInstance } from "fastify";
import {
  AddProductInput,
  addProductJsonSchema,
  searchQueryJsonSchema,
  slugParamJsonSchema,
  UpdateProductInput,
  updateProductJsonSchema,
} from "./schemas";
import {
  idParamType,
  idParamJsonSchema,
} from "@/shared/validations/id-param.schema";
import { ProductController } from "./controllers/product.controller";

const productRoutes = (fastify: FastifyInstance) => {
  const ctrl = new ProductController();

  fastify.addHook("preHandler", fastify.authenticate);

  fastify
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
