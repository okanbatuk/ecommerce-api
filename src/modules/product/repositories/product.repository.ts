import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared";
import { ProductMapper } from "../mappers/product.mapper";
import { Repository } from "@/shared/repositories/base.repository";
import { prismaProductFilter } from "../utils/prisma-product.filter";

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
  protected readonly softDelete: boolean;

  protected toDomain = ProductMapper.toDomainProduct;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    super(prisma);
    this.softDelete = true;
  }

  async restore(id: string): Promise<Product> {
    const row = await this.delegate.update({
      where: { id },
      data: { isDeleted: false },
    });
    return this.toDomain(row);
  }
}
