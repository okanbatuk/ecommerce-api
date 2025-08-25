import { inject, injectable } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import { normalizeUpdateFields } from "../utils";
import { BaseController, Role, type SlugParam, TYPES } from "@/shared";

import type { AddProductInput, UpdateProductInput } from "../schemas";
import type { ProductFilter } from "../domain";
import type { IProductService } from "../interfaces";
import type { ProductDto } from "../dtos/product.dto";

@injectable()
export class ProductController extends BaseController<
  ProductDto,
  UpdateProductInput,
  ProductFilter,
  IProductService
> {
  constructor(
    @inject(TYPES.ProductService)
    productService: IProductService,
  ) {
    super(productService);
  }

  /* GET /products/:slug */
  getBySlug = async (
    req: FastifyRequest<{ Params: SlugParam }>,
    res: FastifyReply,
  ): Promise<void> => {
    const product = await this.service.getBySlug(req.params.slug);
    return this.ok(res, product, "Product");
  };

  /* POST /products */
  create = async (
    req: FastifyRequest<{ Body: AddProductInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    const addedProduct = await this.service.create(req.body);

    return this.created(res, addedProduct, "Product");
  };

  /* PATCH /products/:id */
  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateProductInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    return this.updateCore(req, res, normalizeUpdateFields);
  };

  /* PATCH /product/:id/restore */
  restore = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.assertExists(req.params.id, req.user.role === Role.ADMIN);

    await this.service.restore(req.params.id);
    return this.updated(res, "Product");
  };

  /* DELETE /product/:id */
  delete = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.removeCore(req, res);
    return this.noContent(res, "Product");
  };
}
