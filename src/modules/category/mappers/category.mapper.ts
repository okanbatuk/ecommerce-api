import { Prisma, Category as PrismaCategory } from "@prisma/client";
import { ProductMapper } from "@/modules/product/mappers";
import type { Category } from "../entities";
import type { CategoryDto } from "../dtos/category.dto";

type RawCategory =
  | PrismaCategory
  | Prisma.CategoryGetPayload<{ include: { products: true } }>;

export class CategoryMapper {
  static toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      isDeleted: category.isDeleted,
      products: category.products
        ? category.products.map((p) => ProductMapper.toDto(p))
        : undefined,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  static toDomainEntity = (raw: RawCategory): Category => ({
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    parentId: raw.parentId,
    products:
      "products" in raw
        ? ProductMapper.toDomainEntities(raw.products)
        : undefined,
    isDeleted: raw.isDeleted,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}
