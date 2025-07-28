export interface IService<T, U = Partial<T>, F = Partial<T>> {
  findAll({ limit, offset }: { limit: number; offset: number }): Promise<T[]>;

  findOne(filter: F): Promise<T>;

  update(id: string, data: U): Promise<T>;

  delete(id: string): Promise<void>;
}
