import { Prisma } from "@prisma/client";
import { Pagination } from "../types";

export interface IRepository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  W = Partial<T>,
  M extends Prisma.ModelName = Prisma.ModelName,
> {
  findAll(pagination?: Pagination): Promise<T[]>;
  findMany(filter?: W, pagination?: Pagination): Promise<T[]>;
  findOne(where: W): Promise<T | null>;
  create(data: C): Promise<T>;
  update(id: string, data: U): Promise<T>;
  delete(id: string): Promise<void>;
}
