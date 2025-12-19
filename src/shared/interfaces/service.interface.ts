import type { Pagination } from "../types";

/** @deprecated Cant use this interface. */
export interface IService<T, U = Partial<T>, F = Partial<T>> {
  findAll(p: Pagination): Promise<T[]>;

  findMany(filter: F, p: Pagination): Promise<T[]>;

  findOne(filter: F): Promise<T>;

  update(id: string, data: U): Promise<T>;

  delete(id: string): Promise<void>;
}
