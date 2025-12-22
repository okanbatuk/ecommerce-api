export interface CategoryQuery {
  id?: number;
  name?: string;
  slug?: string;
  parentId?: number | null;

  search?: string;

  options?: {
    includeDeleted?: boolean;
  };
}
