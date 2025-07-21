import { Prisma, PrismaClient } from "@prisma/client";
import { IRepository } from "../interfaces/repository.interface";
import { CreateUserInput, UpdateUserInput } from "@modules/user/schemas";

export abstract class Repository<T> implements IRepository<T> {
  protected abstract readonly modelName: keyof PrismaClient;

  constructor(protected readonly prisma: PrismaClient) {}

  protected get delegate() {
    return this.prisma[this.modelName] as any;
  }

  async findAll({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<T[]> {
    return this.delegate.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  }
  async findOne(where: Prisma.UserWhereInput): Promise<T | null> {
    return this.delegate.findFirst({ where });
  }
  async findById(id: string): Promise<T | null> {
    return this.delegate.findUnique({ where: { id } });
  }
  async create(data: CreateUserInput): Promise<T> {
    return this.delegate.create({ data });
  }
  async update(id: string, data: UpdateUserInput): Promise<T> {
    return this.delegate.update({ where: { id }, data });
  }
  async delete(id: string): Promise<void> {
    await this.delegate.delete({ where: { id } });
  }
}
