export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
