import type { CategoryFilter } from "../filters";
import type { CategoryDto } from "../dtos/category.dto";
import type { AddCategoryInput, UpdateCategoryInput } from "../schemas";

export interface ICategoryService {
  findById(id: number): Promise<CategoryDto>;
  findBySlug(slug: string): Promise<CategoryDto>;

  findMany(
    filter?: CategoryFilter,
    options?: {
      includeDeleted?: boolean;
    },
  ): Promise<CategoryDto[]>;

  create(input: AddCategoryInput): Promise<CategoryDto>;
  update(id: number, input: UpdateCategoryInput): Promise<CategoryDto>;

  delete(id: number): Promise<void>;
  restore(id: number): Promise<CategoryDto>;
  deletePermanently(id: number): Promise<void>;
}
