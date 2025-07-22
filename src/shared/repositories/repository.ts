import { PrismaClient } from "@prisma/client";
import { IRepository } from "../interfaces/repository.interface";

export abstract class Repository<
  T,
  C = Partial<T>,
  U = Partial<T>,
  F = Partial<T>
> implements IRepository<T, C, U, F>
{
  protected abstract readonly modelName: keyof PrismaClient;

  protected abstract toPrismaFilter(f: F): Record<string, any>;

  constructor(protected readonly prisma: PrismaClient) {}

  protected get delegate() {
    return this.prisma[this.modelName] as any;
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
