export type ProductFilter = {
  id?: string;
  slug?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isDeleted?: boolean;
};
