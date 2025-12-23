export interface IDeletable {
  delete(id: number): Promise<void>;
  deletePermanently(id: number): Promise<void>;
}
