import { vi } from "vitest";
import type { Category } from "@modules/category/entity";
import type { ICategoryRepository } from "@/modules/category/interfaces/repository";
import type { CategoryFilter } from "@/modules/category/filters";

export const mockCategoryRepository = (): ICategoryRepository => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Electronic",
      slug: "electronic",
      parentId: null,
      products: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Computer",
      slug: "electronic-computer",
      parentId: 1,
      products: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Fridge",
      slug: "electronic-fridge",
      parentId: 1,
      products: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: "Tv",
      slug: "electronic-tv",
      parentId: 1,
      products: [],
      isDeleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      name: "Laptop",
      slug: "computer-laptop",
      parentId: 2,
      products: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      name: "Smartphone",
      slug: "electronic-smartphone",
      parentId: 1,
      products: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      name: "Deleted Root",
      slug: "deleted-root",
      parentId: null,
      products: [],
      isDeleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const applyVisibility = (
    items: Category[],
    options?: { includeDeleted?: boolean },
  ) => {
    if (options?.includeDeleted) return items;
    return items.filter((c) => !c.isDeleted);
  };

  const filterCategories = (
    items: Category[],
    filter: CategoryFilter = {},
    search?: string,
  ) => {
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
  };

  return {
    create: vi.fn<ICategoryRepository["create"]>(async (data) => {
      const newCategory: Category = {
        ...data,
        id: categories.length + 1,
        parentId: data.parentId || null,
        products: [],
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      categories.push(newCategory);
      return newCategory;
    }),
    update: vi.fn<ICategoryRepository["update"]>(async (id, data) => {
      const category = categories.find((c) => c.id === id);
      if (!category) throw new Error("Category not found");
      Object.assign(category, data, { updatedAt: new Date() });
      return category;
    }),
    delete: vi.fn<ICategoryRepository["delete"]>(async (id) => {
      const category = categories.find((c) => c.id === id);
      if (category) category.isDeleted = true;
    }),
    restore: vi.fn<ICategoryRepository["restore"]>(async (id) => {
      const category = categories.find((c) => c.id === id);
      if (!category) throw new Error("Category not found");
      category.isDeleted = false;
      return category;
    }),
    deletePermanently: vi.fn<ICategoryRepository["deletePermanently"]>(
      async (id) => {
        const index = categories.findIndex((c) => c.id === id);
        if (index !== -1) categories.splice(index, 1);
      },
    ),
    findById: vi.fn<ICategoryRepository["findById"]>(async (id, opt) => {
      const visible = applyVisibility(categories, opt);
      return visible.find((c) => c.id === id) ?? null;
    }),
    findBySlug: vi.fn<ICategoryRepository["findBySlug"]>(async (slug, opt) => {
      const visible = applyVisibility(categories, opt);
      return visible.find((c) => c.slug === slug) ?? null;
    }),
    findRoots: vi.fn<ICategoryRepository["findRoots"]>(async (opt) =>
      applyVisibility(categories, opt).filter((c) => c.parentId === null),
    ),
    findChildren: vi.fn<ICategoryRepository["findChildren"]>(
      async (parentId, opt) => {
        const visible = applyVisibility(categories, opt);
        return visible.filter((c) => c.parentId === parentId);
      },
    ),
    findMany: vi.fn<ICategoryRepository["findMany"]>(
      async (filter = {}, options) => {
        const visible = applyVisibility(categories, options);
        return filterCategories(visible, filter, options?.search);
      },
    ),
  };
};
