export interface IRepository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  W = Partial<T>
> {
  findAll({ limit, offset }: { limit: number; offset: number }): Promise<T[]>;
  findOne(where: W): Promise<T | null>;
  create(data: C): Promise<T>;
  update(id: string, data: U): Promise<T>;
  delete(id: string): Promise<void>;
}
