import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib";
import { Product } from "../domain/product.entity";
import { ProductFilter } from "../domain/product.filter";
import { Repository } from "@/shared/repositories/repository";
import { toDomainProduct } from "../mappers/product-entity.mapper";
import { prismaProductFilter } from "../utils/prisma-product.filter";
import { CreateProductInput } from "../schemas/create-product.schema";
import { UpdateProductInput } from "../schemas/update-product.schema";
import { IProductRepository } from "../interfaces/product-repository.interface";

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

  constructor() {
    super(prisma);
  }
}
