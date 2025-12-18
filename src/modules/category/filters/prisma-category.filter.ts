import { Prisma } from "@prisma/client";
import type { CategoryFilter } from "./category.filter";

export const prismaCategoryFilter = (
  f: CategoryFilter,
): Prisma.CategoryWhereInput => {
  const where: Prisma.CategoryWhereInput = {};

  if (f.id !== undefined) where.id = f.id;
  if (f.name) where.name = f.name;
  if (f.slug) where.slug = f.slug;
  if (f.parentId !== undefined) where.parentId = f.parentId;
  if (f.isDeleted !== undefined) where.isDeleted = f.isDeleted;

  return where;
};
