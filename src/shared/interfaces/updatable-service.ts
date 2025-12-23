export interface IUpdatable<TUpdate, TDto> {
  update(id: number, input: TUpdate): Promise<TDto>;
}
