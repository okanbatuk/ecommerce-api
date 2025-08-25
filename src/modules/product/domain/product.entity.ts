export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
