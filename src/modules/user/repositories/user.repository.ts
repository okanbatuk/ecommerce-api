import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { toDomainUser } from "../mappers";
import { prismaUserFilter } from "../utils";
import { caseInsensitive, Repository, TYPES } from "@/shared";

import type { User, UserFilter } from "../domain";
import type { CreateUserInput, UpdateUserInput } from "../schemas";
import type { IUserRepository } from "../interfaces/user-repository.interface";

@injectable()
export class UserRepository
  extends Repository<User, CreateUserInput, UpdateUserInput, UserFilter, "User">
  implements IUserRepository
{
  protected readonly modelName = "User" as const;

  protected toDomain = toDomainUser;

  protected toPrismaFilter(f: UserFilter): Record<string, any> {
    return prismaUserFilter(f);
  }

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async getTokenVersion(id: string): Promise<number | null> {
    const row = await this.delegate.findFirst({
      where: { id },
      select: { tokenVersion: true },
    });
    return row?.tokenVersion ?? null;
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    const row = await this.delegate.findFirst({
      where: {
        OR: [
          { username: caseInsensitive(identifier) },
          { email: caseInsensitive(identifier) },
        ],
      },
    });
    return row ? this.toDomain(row) : null;
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await this.delegate.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.delegate.update({
      where: { id },
      data: { password },
    });
  }
}
