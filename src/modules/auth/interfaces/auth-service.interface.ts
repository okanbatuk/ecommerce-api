import { TokenResponseDto } from "../dtos";
import { CreateUserInput } from "../../user/schemas";
import { LoginInput } from "../schemas/login.schema";

export interface IAuthService {
  login(data: LoginInput): Promise<TokenResponseDto>;
  refresh(refreshToken: string): Promise<TokenResponseDto>;
  revoke(refreshToken: string): Promise<void>;
  revokeAll(userId: string): Promise<void>;
  register(dto: CreateUserInput): Promise<void>;
}
