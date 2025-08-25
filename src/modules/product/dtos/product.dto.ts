export type ProductDto = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
