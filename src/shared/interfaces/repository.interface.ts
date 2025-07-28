import { Prisma } from "@prisma/client";

export interface IRepository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  W = Partial<T>,
  M extends Prisma.ModelName = Prisma.ModelName,
> {
  findAll({ limit, offset }: { limit: number; offset: number }): Promise<T[]>;
  findOne(where: W): Promise<T | null>;
  create(data: C): Promise<T>;
  update(id: string, data: U): Promise<T>;
  delete(id: string): Promise<void>;
}
