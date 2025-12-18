import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { CreateCategoryData, UpdateCategoryData } from "../schemas";

export interface ICategoryRepository {
  create(data: CreateCategoryData): Promise<Category>;
  update(id: number, data: UpdateCategoryData): Promise<Category>;
  delete(id: number): Promise<void>;
  restore(id: number): Promise<Category>;
  deletePermanently(id: number): Promise<void>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findRoots(): Promise<Category[]>;
  findChildren(parentId: number): Promise<Category[]>;
  findMany(
    filter: CategoryFilter,
    pagination?: { limit: number; offset: number },
  ): Promise<Category[]>;
}
