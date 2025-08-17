import { inject, injectable } from "inversify";
import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtService } from "../interfaces/jwt-service.interface";
import { TYPES } from "@/shared";
import type { JwtConfig } from "../types/jwt/jwt-config.type";
import type { TokenType } from "../types/jwt/jwt.types";
import type { JwtPayload } from "../types/jwt/jwt-payload.type";

@injectable()
export class JwtService implements IJwtService {
  constructor(@inject(TYPES.JwtConfig) private readonly cfg: JwtConfig) {}

  private pick(tokenType: TokenType): {
    secret: string;
    expires: string;
  } {
    return tokenType === "access"
      ? { secret: this.cfg.accessSecret, expires: this.cfg.accessExpiresIn }
      : { secret: this.cfg.refreshSecret, expires: this.cfg.refreshExpiresIn };
  }

  sign(payload: JwtPayload, tokenType: TokenType = "access"): string {
    const { secret, expires } = this.pick(tokenType);

    return jwt.sign(payload, secret, {
      expiresIn: expires,
      issuer: this.cfg.issuer,
      audience: this.cfg.audience,
    } as SignOptions);
  }

  verify(token: string, tokenType: TokenType): JwtPayload {
    const { secret } = this.pick(tokenType);
    return jwt.verify(token, secret) as JwtPayload;
  }
  decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
  refresh(token: string): string {
    const payload = this.verify(token, "refresh");
    delete payload.iat; // Remove issued at timestamp
    delete payload.exp; // Remove expiration timestamp
    return this.sign(payload, "access");
  }
}
