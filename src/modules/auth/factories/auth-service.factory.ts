import { jwtConfig } from "@/config";
import { JwtService } from "../services/jwt.service";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "@modules/user/repositories/user.repository";

export class AuthServiceFactory {
  private static instance: AuthService | null = null;

  static getInstance(): AuthService {
    if (!this.instance) {
      const jwtService = new JwtService(jwtConfig);
      const userRepository = new UserRepository();
      this.instance = new AuthService(userRepository, jwtService);
    }
    return this.instance;
  }
}
