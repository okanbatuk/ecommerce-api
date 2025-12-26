import type { ICategoryService } from "@/modules/category/interfaces/service";
import { vi } from "vitest";
import { mockCategoryDto } from "../data";

export const categoryServiceMock: ICategoryService = {
  findById: vi.fn().mockResolvedValue(mockCategoryDto),
  findMany: vi.fn().mockResolvedValue([mockCategoryDto]),
  findBySlug: vi.fn().mockResolvedValue(mockCategoryDto),
  findRoots: vi.fn().mockResolvedValue([mockCategoryDto]),
  findChildren: vi.fn().mockResolvedValue([mockCategoryDto]),
  create: vi.fn().mockResolvedValue(mockCategoryDto),
  update: vi.fn().mockResolvedValue(mockCategoryDto),
  delete: vi.fn(),
  restore: vi.fn().mockResolvedValue(mockCategoryDto),
  deletePermanently: vi.fn(),
};
