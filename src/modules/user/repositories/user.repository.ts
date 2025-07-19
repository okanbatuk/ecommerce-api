import { PrismaClient } from "@prisma/client";
import { User } from "../user.entity";
import { caseInsensitive } from "../../../shared/lib/prisma.utils";
import { Repository } from "../../../shared/repositories/repository";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  protected readonly modelName = "user" as const;

  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.delegate.findFirst({
      where: {
        OR: [
          { username: caseInsensitive(identifier) },
          { email: caseInsensitive(identifier) },
        ],
      },
    });
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.delegate.findUnique({
      where: { username: caseInsensitive(username) },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.delegate.findUnique({
      where: { email: caseInsensitive(email) },
    });
  }
}
