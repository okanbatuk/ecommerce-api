import { FastifyInstance } from "fastify";
import {
  addProductJsonSchema,
  searchQueryJsonSchema,
  slugParamJsonSchema,
  updateProductJsonSchema,
} from "./schemas";
import { ProductController } from "./controllers/product.controller";
import { idParamJsonSchema } from "@/shared/validations/id-param.schema";

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
    .post(
      "/",
      {
        // preHandler: [fastify.assertAdmin],
        schema: { body: addProductJsonSchema },
      },
      ctrl.create,
    )
    .patch(
      "/:id",
      {
        // preHandler: [fastify.assertAdmin],
        schema: { body: updateProductJsonSchema },
      },
      ctrl.update,
    );
};

export default productRoutes;
