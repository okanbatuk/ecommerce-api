export interface ISoftDeletable<TDto> {
  restore(id: number): Promise<TDto>;
  deletePermanently(id: number): Promise<void>;
}
