export type ProductDto = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
