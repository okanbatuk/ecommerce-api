import { Product as PrismaProduct } from "@prisma/client";
import { Product } from "../domain";
import { ProductDto } from "../dtos/product.dto";

export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      price: product.price,
      stock: product.stock,
      isDeleted: product.isDeleted,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  static toDomainProduct = (p: PrismaProduct): Product => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? undefined,
    price: p.price.toNumber(),
    stock: p.stock,
    images: p.images ?? [],
    categoryId: p.categoryId,
    isDeleted: p.isDeleted,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  });

  static toDomainEntities = (pArr: PrismaProduct[]): Product[] => {
    return pArr.map((p) => this.toDomainProduct(p));
  };
}
