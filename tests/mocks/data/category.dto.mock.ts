import { CategoryDto } from "@/modules/category/dtos/category.dto";

export const mockCategoryDto: CategoryDto = {
  id: 1,
  name: "Electronics",
  slug: "electronics",
  products: [],
  parentId: null,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
