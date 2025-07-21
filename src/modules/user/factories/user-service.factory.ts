import { prisma } from "@shared/lib/prisma";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";

export class UserServiceFactory {
  private static instance: UserService | null = null;

  static getInstance(): UserService {
    if (!this.instance) {
      const userRepository = new UserRepository(prisma);
      this.instance = new UserService(userRepository);
    }
    return this.instance;
  }
}
