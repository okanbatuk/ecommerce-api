export interface ICreatable<TCreate, TDto> {
  create(input: TCreate): Promise<TDto>;
}
