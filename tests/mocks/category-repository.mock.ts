import { vi } from "vitest";
import type { Category } from "@modules/category/entities";
import type { ICategoryRepository } from "@modules/category/interfaces/category-repository.interface";
import { CategoryFilter } from "@/modules/category/filters";

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
  ];

  const filterCategories = (
    filter: CategoryFilter = {},
    options?: { includeDeleted?: boolean },
  ) => {
    return categories.filter((c) => {
      if (filter.id !== undefined && c.id !== filter.id) return false;
      if (filter.parentId !== undefined && c.parentId !== filter.parentId)
        return false;
      if (filter.isDeleted !== undefined && c.isDeleted !== filter.isDeleted)
        return false;
      if (
        filter.name &&
        !c.name.toLowerCase().includes(filter.name.toLowerCase())
      )
        return false;
      if (
        filter.slug &&
        !c.slug.toLowerCase().includes(filter.slug.toLowerCase())
      )
        return false;
      if (filter.search) {
        const s = filter.search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(s) &&
          !c.slug.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  };

  return {
    create: vi.fn(async (data) => {
      const newCategory: Category = {
        ...data,
        id: categories.length + 1,
        products: [],
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      categories.push(newCategory);
      return newCategory;
    }),
    update: vi.fn(async (id, data) => {
      const category = categories.find((c) => c.id === id);
      if (!category) throw new Error("Category not found");
      Object.assign(category, data, { updatedAt: new Date() });
      return category;
    }),
    delete: vi.fn(async (id) => {
      const category = categories.find((c) => c.id === id);
      if (category) category.isDeleted = true;
    }),
    restore: vi.fn(async (id) => {
      const category = categories.find((c) => c.id === id);
      if (!category) throw new Error("Category not found");
      category.isDeleted = false;
      return category;
    }),
    deletePermanently: vi.fn(async (id) => {
      const index = categories.findIndex((c) => c.id === id);
      if (index !== -1) categories.splice(index, 1);
    }),
    findById: vi.fn(async (id) => categories.find((c) => c.id === id) ?? null),
    findBySlug: vi.fn(
      async (slug) => categories.find((c) => c.slug === slug) ?? null,
    ),
    findRoots: vi.fn(async () => categories.filter((c) => c.parentId === null)),
    findChildren: vi.fn(async (parentId) =>
      categories.filter((c) => c.parentId === parentId),
    ),
    findMany: vi.fn(async (filter = {}, options?) =>
      filterCategories(filter, options),
    ),
  };
};
