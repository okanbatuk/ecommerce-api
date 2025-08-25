import { Prisma } from "@prisma/client";
import { CategoryFilter } from "./category.filter";

export const prismaCategoryFilter = (
  f: CategoryFilter,
): Prisma.CategoryWhereInput => ({
  ...f,
});
