export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
