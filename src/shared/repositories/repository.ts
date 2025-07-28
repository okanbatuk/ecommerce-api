import { Prisma, PrismaClient } from "@prisma/client";
import { IRepository } from "../interfaces/repository.interface";
import { uncapitalize } from "../utils";

export abstract class Repository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  F = Partial<T>,
  M extends Prisma.ModelName = Prisma.ModelName,
> implements IRepository<T, C, U, F>
{
  protected abstract readonly modelName: M;

  protected abstract toPrismaFilter(f: F): Record<string, any>;

  constructor(protected readonly prisma: PrismaClient) {}

  protected get delegate() {
    const key = uncapitalize(this.modelName) as Uncapitalize<M>;
    return (this.prisma as any)[key];
  }
  protected abstract toDomain(raw: any): T;

  async findAll({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<T[]> {
    const rows = await this.delegate.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
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
    await this.delegate.delete({ where: { id } });
  }
}
