import type { IReadable, ISoftDeletable, IWritable } from "@/shared";
import type { CategoryDto } from "../dtos/category.dto";
import type { CategoryQuery } from "../filters";
import type { AddCategoryInput } from "../schemas/add-input";
import type { UpdateCategoryInput } from "../schemas/update-input";

export interface ICategoryService
  extends
    IReadable<CategoryQuery, CategoryDto>,
    IWritable<AddCategoryInput, UpdateCategoryInput, CategoryDto>,
    ISoftDeletable<CategoryDto> {
  findBySlug(slug: string): Promise<CategoryDto>;
}
