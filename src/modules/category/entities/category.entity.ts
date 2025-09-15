import { Product } from "@/modules/product/domain";

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  products: Product[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}
