import type { JwtPayload, TokenType } from "../types/jwt";

export interface IJwtService {
  sign(payload: JwtPayload, tokenType?: TokenType): string;
  verify(token: string, tokenType: TokenType): JwtPayload;
  decode(token: string): JwtPayload | null;
  refresh(token: string): string;
}
