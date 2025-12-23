export interface IRestorable<TDto> {
  restore(id: number): Promise<TDto>;
}
