import { PrismaClient } from "@prisma/client";
import { User } from "../user.entity";
import { caseInsensitive } from "@shared/lib/prisma.utils";
import { Repository } from "@shared/repositories/repository";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  protected readonly modelName = "user" as const;

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.delegate.findFirst({
      where: {
        OR: [
          { username: caseInsensitive(identifier) },
          { email: caseInsensitive(identifier) },
        ],
      },
    });
  }
  async updatePassword(id: string, password: string): Promise<void> {
    await this.delegate.update({
      where: { id },
      data: { password },
    });
  }
}
