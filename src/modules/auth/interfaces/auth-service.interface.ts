import type { TokenResponseDto } from "../dtos";
import type { LoginInput, RegisterInput } from "../schemas";

export interface IAuthService {
  login(data: LoginInput, deviceId: string): Promise<TokenResponseDto>;
  refresh(refreshToken: string): Promise<TokenResponseDto>;
  revoke(refreshToken: string): Promise<void>;
  revokeAll(userId: string): Promise<void>;
  register(dto: RegisterInput): Promise<void>;
}
