import type { ProductDto } from "@/modules/product/dtos/product.dto";

export type CategoryDto = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  products: ProductDto[] | undefined;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
