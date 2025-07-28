export interface ICreatable<T, C> {
  create(data: C): Promise<T>;
}
