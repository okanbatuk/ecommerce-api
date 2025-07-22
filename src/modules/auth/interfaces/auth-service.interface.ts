import { TokenResponseDto } from "../dtos";
import { LoginInput, RegisterInput } from "../schemas";

export interface IAuthService {
  login(data: LoginInput): Promise<TokenResponseDto>;
  refresh(refreshToken: string): Promise<TokenResponseDto>;
  revoke(refreshToken: string): Promise<void>;
  revokeAll(userId: string): Promise<void>;
  register(dto: RegisterInput): Promise<void>;
}
