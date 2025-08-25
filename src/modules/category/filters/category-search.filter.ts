import { CategoryFilter } from "./category.filter";

export type CategorySearchFilter = Omit<CategoryFilter, "id"> & {
  limit?: number;
  offset?: number;
};
