import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";
import { Repository, TYPES } from "@/shared";
import { CategoryMapper } from "../mappers/category.mapper";
import { prismaCategoryFilter } from "../filters/prisma-category.filter";

import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { ICategoryRepository } from "../interfaces";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schemas";

@injectable()
export class CategoryRepository
  extends Repository<
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryFilter,
    "Category"
  >
  implements ICategoryRepository
{
  protected readonly modelName = "Category" as const;
  protected toPrismaFilter(f: CategoryFilter): Record<string, any> {
    return prismaCategoryFilter(f);
  }

  protected toDomain = CategoryMapper.toDomainEntity;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }
}
