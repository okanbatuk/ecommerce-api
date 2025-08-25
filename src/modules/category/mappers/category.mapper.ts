import { Category as PrismaCategory } from "@prisma/client";
import { CategoryDto } from "../dtos/category.dto";
import { Category } from "../entities";

export class CategoryMapper {
  static toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  static toDomainEntity = (p: PrismaCategory): Category => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    parentId: p.parentId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  });
}
