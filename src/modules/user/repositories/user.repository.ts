import { toDomainUser } from "../mappers";
import { prismaUserFilter } from "../utils";
import { User, UserFilter } from "../domain";
import { IUserRepository } from "../interfaces";
import { caseInsensitive, prisma } from "@/shared/lib";
import { Repository } from "@shared/repositories/repository";
import { CreateUserInput, UpdateUserInput } from "../schemas";

export class UserRepository
  extends Repository<User, CreateUserInput, UpdateUserInput, UserFilter, "User">
  implements IUserRepository
{
  private static _instance: UserRepository;

  // Get User Repository instance Singleton
  static getInstance(): UserRepository {
    return (this._instance ||= new UserRepository());
  }

  protected readonly modelName = "User" as const;

  protected toDomain = toDomainUser;

  protected toPrismaFilter(f: UserFilter): Record<string, any> {
    return prismaUserFilter(f);
  }

  constructor() {
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
