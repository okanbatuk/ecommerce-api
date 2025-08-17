import { inject, injectable } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import { ProductSearchFilter } from "../domain";
import { ProductDto } from "../dtos/product.dto";
import { RES_MSG, ResponseCode, sendReply } from "@/shared";
import { ProductService } from "../services/product.service";
import { ServiceFactory } from "@/shared/factories/service.factory";
import { ProductRepository } from "../repositories/product.repository";
import { AddProductInput, SlugParam, UpdateProductInput } from "../schemas";

import type {
  AddProductInput,
  SlugParam,
  UpdateProductInput,
} from "../schemas";
import type { ProductFilter } from "../domain";
import type { IProductService } from "../interfaces";
import type { ProductDto } from "../dtos/product.dto";

  private async assertProductExists(id: string): Promise<ProductDto> {
    return await this.productService.findOne({ id });
  }

  /* GET /products/:id */
  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const product = await this.assertProductExists(req.params.id);

    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      product,
      RES_MSG.FOUND("Product"),
    );
  };

  /* GET /products/:slug */
  getBySlug = async (
    req: FastifyRequest<{ Params: SlugParam }>,
    res: FastifyReply,
  ): Promise<void> => {
    const product = await this.productService.getBySlug(req.params.slug);
    return sendReply(
      res,
      200,
      ResponseCode.OK,
      product,
      RES_MSG.FOUND("Product"),
    );
  };

  /* GET /products?name=phone&minPrice=100&maxPrice=500&inStock=true&limit=10&offset=0 */
  search = async (
    req: FastifyRequest<{ Querystring: ProductSearchFilter }>,
    res: FastifyReply,
  ) => {
    const {
      name,
      minPrice,
      maxPrice,
      inStock,
      isActive = true,
      limit = 20,
      offset = 0,
    } = req.query;

    const where: ProductSearchFilter = Object.fromEntries(
      Object.entries({
        name: name?.trim().toLowerCase(),
        minPrice,
        maxPrice,
        inStock,
        isActive,
      }).filter(([_, value]) => value !== undefined && value !== null),
    );

    const result = Object.keys(where).length
      ? await this.productService.findMany(where, { limit, offset })
      : await this.productService.findAll({ limit, offset });

    return sendReply(
      res,
      200,
      ResponseCode.OK,
      result,
      RES_MSG.ALL("Products"),
    );
  };

  /* POST /products */
  create = async (
    req: FastifyRequest<{ Body: AddProductInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    const addedProduct = await this.productService.create(req.body);

    return sendReply(
      res,
      201,
      ResponseCode.CREATED,
      addedProduct,
      RES_MSG.CREATED("Product"),
    );
  };

  /* PATCH /products/:id */
  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateProductInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.assertProductExists(req.params.id);

    const updatedProduct = await this.productService.update(
      req.params.id,
      req.body,
    );
    return sendReply(
      res,
      200,
      ResponseCode.CREATED,
      updatedProduct,
      RES_MSG.UPDATED("Product"),
    );
  };

  /* DELETE /product/:id */
  delete = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.assertProductExists(req.params.id);

    await this.productService.delete(req.params.id);
    return sendReply(
      res,
      200,
      ResponseCode.OK,
      null,
      RES_MSG.DELETED("Product"),
    );
  };
}
