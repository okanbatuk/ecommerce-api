import type { FindManyOptions, FindOptions } from "@/shared";
import type { Category } from "../entity";
import type { CategoryFilter } from "../filters";
import type { CreateCategoryData } from "../schemas/create-data";
import type { UpdateCategoryData } from "../schemas/update-data";

export interface ICategoryRepository {
  create(data: CreateCategoryData): Promise<Category>;
  update(id: number, data: UpdateCategoryData): Promise<Category>;
  delete(id: number): Promise<void>;
  restore(id: number): Promise<Category>;
  deletePermanently(id: number): Promise<void>;
  findById(id: number, options?: FindOptions): Promise<Category | null>;
  findBySlug(slug: string, options?: FindOptions): Promise<Category | null>;
  findRoots(options?: FindOptions): Promise<Category[]>;
  findChildren(parentId: number, options?: FindOptions): Promise<Category[]>;
  findMany(
    filter: CategoryFilter,
    options?: FindManyOptions,
  ): Promise<Category[]>;
}
