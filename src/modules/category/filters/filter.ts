export interface CategoryFilter {
  id?: number;
  name?: string;
  slug?: string;
  parentId?: number | null;
  isDeleted?: boolean;
}
