export interface IWritable<TCreate, TUpdate, TDto> {
  create(input: TCreate): Promise<TDto>;
  update(id: number, input: TUpdate): Promise<TDto>;
  delete(id: number): Promise<void>;
}
