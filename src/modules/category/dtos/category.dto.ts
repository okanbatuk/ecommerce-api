import { Product } from "@/modules/product/domain";

export type CategoryDto = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  products: Product[] | undefined;
  createdAt: string;
  updatedAt: string;
};
