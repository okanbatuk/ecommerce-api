import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";

export class UserServiceFactory {
  private static instance: UserService | null = null;

  static getInstance(): UserService {
    if (!this.instance) {
      const userRepository = new UserRepository();
      this.instance = new UserService(userRepository);
    }
    return this.instance;
  }
}
