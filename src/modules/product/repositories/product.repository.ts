import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Pagination, TYPES } from "@/shared";
import { Repository } from "@/shared/repositories/base.repository";
import { toDomainProduct } from "../mappers/product-entity.mapper";
import { prismaProductFilter } from "../utils/prisma-product.filter";
import { CreateProductInput } from "../schemas/create-product.schema";
import { UpdateProductInput } from "../schemas/update-product.schema";
import { IProductRepository } from "../interfaces/product-repository.interface";

import type { Product, ProductFilter } from "../domain";
import type { IProductRepository } from "../interfaces";
import type { CreateProductInput, UpdateProductInput } from "../schemas";

@injectable()
export class ProductRepository
  extends Repository<
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductFilter,
    "Product"
  >
  implements IProductRepository
{
  protected readonly modelName = "Product" as const;

  protected toPrismaFilter(f: ProductFilter): Record<string, any> {
    return prismaProductFilter(f);
  }
  protected toDomain = toDomainProduct;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }
}
