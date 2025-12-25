import type { Category } from "@/modules/category/entity";
import type { CategoryFilter } from "@/modules/category/filters";
import type { ICategoryRepository } from "@/modules/category/interfaces/repository";
import { vi } from "vitest";
import { categories as originalCategories } from "../data";

export class MockCategoryRepository implements ICategoryRepository {
  private categories: Category[];

  constructor(initialData?: Category[]) {
    this.categories = (initialData ?? originalCategories).map((c) => ({
      ...c,
    }));
  }

  private applyVisibility(
    items: Category[],
    options?: { includeDeleted?: boolean },
  ) {
    if (options?.includeDeleted) return items;
    return items.filter((c) => !c.isDeleted);
  }

  private filterCategories(
    items: Category[],
    filter: CategoryFilter = {},
    search?: string,
  ) {
    return items.filter((i) => {
      if (filter.id !== undefined && i.id !== filter.id) return false;
      if (filter.parentId !== undefined && i.parentId !== filter.parentId)
        return false;
      if (
        filter.name &&
        !i.name.toLowerCase().includes(filter.name.toLowerCase())
      )
        return false;
      if (
        filter.slug &&
        !i.slug.toLowerCase().includes(filter.slug.toLowerCase())
      )
        return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !i.name.toLowerCase().includes(s) &&
          !i.slug.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }

  create = vi.fn<ICategoryRepository["create"]>(async (data) => {
    const newCategory: Category = {
      ...data,
      id: this.categories.length + 1,
      parentId: data.parentId ?? null,
      products: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  });

  update = vi.fn<ICategoryRepository["update"]>(async (id, data) => {
    const category = this.categories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    Object.assign(category, data, { updatedAt: new Date() });
    return category;
  });

  delete = vi.fn<ICategoryRepository["delete"]>(async (id) => {
    const category = this.categories.find((c) => c.id === id);
    if (category) category.isDeleted = true;
  });

  restore = vi.fn<ICategoryRepository["restore"]>(async (id) => {
    const category = this.categories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    category.isDeleted = false;
    return category;
  });

  deletePermanently = vi.fn<ICategoryRepository["deletePermanently"]>(
    async (id) => {
      const index = this.categories.findIndex((c) => c.id === id);
      if (index !== -1) this.categories.splice(index, 1);
    },
  );

  findById = vi.fn<ICategoryRepository["findById"]>(async (id, opt) => {
    const visible = this.applyVisibility(this.categories, opt);
    return visible.find((c) => c.id === id) ?? null;
  });

  findBySlug = vi.fn<ICategoryRepository["findBySlug"]>(async (slug, opt) => {
    const visible = this.applyVisibility(this.categories, opt);
    return visible.find((c) => c.slug === slug) ?? null;
  });

  findRoots = vi.fn<ICategoryRepository["findRoots"]>(async (opt) =>
    this.applyVisibility(this.categories, opt).filter(
      (c) => c.parentId === null,
    ),
  );

  findChildren = vi.fn<ICategoryRepository["findChildren"]>(
    async (parentId, opt) => {
      const visible = this.applyVisibility(this.categories, opt);
      return visible.filter((c) => c.parentId === parentId);
    },
  );

  findMany = vi.fn<ICategoryRepository["findMany"]>(
    async (filter = {}, options) => {
      const visible = this.applyVisibility(this.categories, options);
      return this.filterCategories(visible, filter, options?.search);
    },
  );
}
