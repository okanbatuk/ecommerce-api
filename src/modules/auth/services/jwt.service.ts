import { randomUUID } from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtService } from "../interfaces";
import { JwtConfig, JwtPayload, TokenType } from "../types/jwt";

export class JwtService implements IJwtService {
  private readonly cfg: JwtConfig;

  constructor(cfg: JwtConfig) {
    this.cfg = cfg;
  }

  private pick(tokenType: TokenType): {
    secret: string;
    expires: string;
  } {
    return tokenType === "access"
      ? { secret: this.cfg.accessSecret, expires: this.cfg.accessExpiresIn }
      : { secret: this.cfg.refreshSecret, expires: this.cfg.refreshExpiresIn };
  }

  sign(
    payload: JwtPayload,
    opts: { customJti?: string; tokenType?: TokenType }
  ): string {
    const { customJti, tokenType = "access" } = opts;
    const { secret, expires } = this.pick(tokenType);

    const finalPayload: JwtPayload =
      tokenType === "access"
        ? payload
        : { ...payload, jti: customJti ?? randomUUID() };

    return jwt.sign(finalPayload, secret, {
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
    return this.sign(payload, { tokenType: "access" });
  }
}
