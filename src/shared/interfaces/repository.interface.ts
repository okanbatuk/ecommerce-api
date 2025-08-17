import type { Prisma } from "@prisma/client";
import type { Pagination } from "../types";

export interface IRepository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  F = Partial<T>,
  M extends Prisma.ModelName = Prisma.ModelName,
> {
  findAll(pagination?: Pagination): Promise<T[]>;
  findMany(filter?: F, pagination?: Pagination): Promise<T[]>;
  findOne(filter: F): Promise<T | null>;
  create(data: C): Promise<T>;
  update(id: string, data: U): Promise<T>;
  delete(id: string): Promise<void>;
}
