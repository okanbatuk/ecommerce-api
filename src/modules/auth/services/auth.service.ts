import { randomUUID } from "crypto";
import { compare, hash } from "bcryptjs";
import {
  MSG,
  TokenType,
  normalizeFields,
  UnauthorizedError,
  InternalServerError,
} from "@/shared";
import { TokenResponseDto } from "../dtos";
import { User } from "@modules/user/user.entity";
import { logger, config, redis } from "@/config";
import { LoginInput } from "../schemas/login.schema";
import { CreateUserInput } from "@modules/user/schemas";
import { IAuthService, IJwtService } from "../interfaces";
import { JwtPayload } from "../types/jwt/jwt-payload.type";
import { IUserRepository } from "@modules/user/interfaces/user-repository.interface";

const REFRESH_TTL = Number(config.jwt.refreshExpiresIn) || 604_800;

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

  private async assertUnique(email: string, username: string): Promise<void> {
    const [byEmail, byUsername] = await Promise.all([
      this.userRepository.findOne({ email }),
      this.userRepository.findOne({ username }),
    ]);
    if (byEmail || byUsername)
      throw new UnauthorizedError(byEmail ? MSG.EMAIL : MSG.USERNAME);
  }

  private payload = (
    user: Pick<User, "id" | "email" | "username">
  ): JwtPayload => {
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      jti: randomUUID(),
    };
  };

  private redisKey = (userId: string, jti: string): string => {
    return `refresh:${userId}:${jti}`;
  };

  async register(dto: CreateUserInput): Promise<void> {
    const { email, username } = normalizeFields(dto);
    await this.assertUnique(email, username);
    const hashed = await hash(dto.password, 10);
    await this.userRepository.create({ ...dto, password: hashed });
  }

  async login({ identifier, password }: LoginInput): Promise<TokenResponseDto> {
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user || !(await compare(password, user.password)))
      throw new UnauthorizedError(MSG.INVALID);

    const payload = this.payload(user);

    const tokens: TokenResponseDto = {
      accessToken: this.jwtService.sign(payload, {
        tokenType: TokenType.ACCESS,
      }),
      refreshToken: this.jwtService.sign(payload, {
        tokenType: TokenType.REFRESH,
        customJti: payload.jti,
      }),
    };

    if (!tokens.refreshToken || !payload.jti)
      throw new InternalServerError(MSG.NO_TOKEN);

    const key = this.redisKey(payload.userId, payload.jti);

    await redis.set(key, tokens.refreshToken, "EX", REFRESH_TTL);

    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const payload = this.jwtService.verify(refreshToken, TokenType.REFRESH);
    if (!payload.jti) throw new UnauthorizedError(MSG.NO_REFRESH);

    const key = this.redisKey(payload.userId, payload.jti);
    const token = await redis.get(key);
    if (!token || token !== refreshToken) {
      await this.revokeAll(payload.userId);
      logger.warn(`Possible token hijack - user ${payload.userId}`);
      throw new UnauthorizedError(MSG.NO_REFRESH);
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) throw new UnauthorizedError(MSG.INVALID);

    const newPayload = this.payload(user);

    const tokens: TokenResponseDto = {
      accessToken: this.jwtService.sign(newPayload, {
        tokenType: TokenType.ACCESS,
      }),
      refreshToken: this.jwtService.sign(newPayload, {
        tokenType: TokenType.REFRESH,
        customJti: newPayload.jti,
      }),
    };

    if (!tokens.refreshToken || !newPayload.jti)
      throw new InternalServerError(MSG.NO_TOKEN);

    await redis.del(key);

    await redis.set(
      this.redisKey(newPayload.userId, newPayload.jti),
      tokens.refreshToken,
      "EX",
      REFRESH_TTL
    );

    return tokens;
  }

  async revoke(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken, TokenType.REFRESH);
    if (!payload.jti) throw new UnauthorizedError(MSG.NO_REFRESH);
    const key = this.redisKey(payload.userId, payload.jti);
    await redis.del(key);
  }

  async revokeAll(userId: string): Promise<void> {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length) await Promise.all(keys.map((key) => redis.del(key)));
  }
}
