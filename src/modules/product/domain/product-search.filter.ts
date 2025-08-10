import { ProductFilter } from "./product.filter";

export type ProductSearchFilter = Omit<ProductFilter, "id"> & {
  limit?: number;
  offset?: number;
};
