import { Prisma, PrismaClient } from "@prisma/client";
import { uncapitalize } from "../formatters";

import type { Pagination } from "../types";
import type { IRepository } from "../interfaces";

export abstract class Repository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  F = Partial<T>,
  M extends Prisma.ModelName = Prisma.ModelName,
> implements IRepository<T, C, U, F>
{
  constructor(protected readonly prisma: PrismaClient) {}

  protected abstract readonly modelName: M;

  protected abstract toPrismaFilter(f: F): Record<string, any>;

  protected get delegate() {
    const key = uncapitalize(this.modelName) as Uncapitalize<M>;
    return (this.prisma as any)[key];
  }
  protected abstract toDomain(raw: any): T;

  protected softDelete = false;

  async findAll(pagination?: Pagination): Promise<T[]> {
    const { limit, offset } = pagination ?? { limit: 20, offset: 0 };
    const rows = await this.delegate.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(this.toDomain);
  }

  async findMany(
    filter?: F | undefined,
    pagination?: { limit: number; offset: number },
  ): Promise<T[]> {
    const { limit, offset } = pagination ?? { limit: 20, offset: 0 };
    const rows = await this.delegate.findMany({
      where: filter ? this.toPrismaFilter(filter) : {},
      skip: offset,
      take: limit,
    });
    return rows.map(this.toDomain);
  }

  async findOne(filter: F): Promise<T | null> {
    const row = await this.delegate.findFirst({
      where: this.toPrismaFilter(filter),
    });
    return row ? this.toDomain(row) : null;
  }

  async create(data: C): Promise<T> {
    const row = await this.delegate.create({ data });
    return this.toDomain(row);
  }
  async update(id: string, data: U): Promise<T> {
    const row = await this.delegate.update({ where: { id }, data });
    return this.toDomain(row);
  }
  async delete(id: string): Promise<void> {
    this.softDelete
      ? await this.delegate.update({
          where: { id },
          data: { isDeleted: true },
        })
      : await this.delegate.delete({ where: { id } });
  }
}
