import type { IRepository } from "@/shared";
import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schemas";

export interface ICategoryRepository
  extends IRepository<
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryFilter,
    "Category"
  > {}
