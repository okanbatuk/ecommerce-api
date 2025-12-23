import type { CrudService, FindOptions } from "@/shared";
import type { CategoryDto } from "../dtos/category.dto";
import type { CategoryQuery } from "../filters";
import type { AddCategoryInput } from "../schemas/add-input";
import type { UpdateCategoryInput } from "../schemas/update-input";

export interface ICategoryService extends CrudService<
  CategoryQuery,
  AddCategoryInput,
  UpdateCategoryInput,
  CategoryDto
> {
  findBySlug(slug: string, opt?: FindOptions): Promise<CategoryDto>;
  findRoots(opt?: FindOptions): Promise<CategoryDto[]>;
  findChildren(id: number, opt?: FindOptions): Promise<CategoryDto[]>;
}
