import { randomUUID } from "crypto";
import { compare, hash } from "bcryptjs";
import {
  RES_MSG,
  Role,
  TokenType,
  UnauthorizedError,
  InternalServerError,
  ConflictError,
} from "@/shared";
import { TokenResponseDto } from "../dtos";
import { logger, config, redis } from "@/config";
import { LoginInput, RegisterInput } from "../schemas";
import { User } from "@/modules/user/domain/user.entity";
import { IAuthService, IJwtService } from "../interfaces";
import { JwtPayload } from "../types/jwt/jwt-payload.type";
import { IUserRepository } from "@modules/user/interfaces/user-repository.interface";
import { normalizeLoginFields, normalizeRegisterFields } from "../utils";

const REFRESH_TTL = Number(config.jwt.refreshExpiresIn) || 604_800;

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  private assertUnique = async (
    email: string,
    username: string,
  ): Promise<void> => {
    const [byEmail, byUsername] = await Promise.all([
      this.userRepository.findOne({ email }),
      this.userRepository.findOne({ username }),
    ]);
    if (byEmail || byUsername)
      throw new ConflictError(
        byEmail ? RES_MSG.DUPLICATE("Email") : RES_MSG.DUPLICATE("Username"),
      );
  };

  private buildPayload = (
    user: Pick<User, "id" | "email" | "username" | "role">,
  ): JwtPayload => {
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
      jti: randomUUID(),
    };
  };

  private redisKey = (userId: string, jti: string): string => {
    return `refresh:${userId}:${jti}`;
  };

  private storeRefresh = async (userId: string, jti: string, token: string) => {
    await redis.set(this.redisKey(userId, jti), token, "EX", REFRESH_TTL);
  };

  private removeRefresh = async (userId: string, jti: string) => {
    await redis.del(this.redisKey(userId, jti));
  };

  private removeAllRefresh = async (userId: string): Promise<void> => {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length) await Promise.all(keys.map((key) => redis.del(key)));
  };

  async register(rawData: RegisterInput): Promise<void> {
    const refinedData = normalizeRegisterFields(rawData);
    const { email, username, password } = refinedData;
    await this.assertUnique(email, username);
    const hashed = await hash(password, 10);
    await this.userRepository.create({
      ...refinedData,
      password: hashed,
      role: Role.USER,
    });
  }

  async login(rawData: LoginInput): Promise<TokenResponseDto> {
    const { identifier, password } = normalizeLoginFields(rawData);
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user || !(await compare(password, user.password)))
      throw new UnauthorizedError(RES_MSG.INVALID("credentials"));

    const payload = this.buildPayload(user);

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
      throw new InternalServerError(RES_MSG.NO_TOKEN());

    await this.storeRefresh(payload.userId, payload.jti, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const payload = this.jwtService.verify(refreshToken, TokenType.REFRESH);
    if (!payload.jti)
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));

    const key = this.redisKey(payload.userId, payload.jti);
    const token = await redis.get(key);
    if (!token || token !== refreshToken) {
      await this.removeAllRefresh(payload.userId);
      logger.warn(`Possible token hijack - user ${payload.userId}`);
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));
    }

    const user = await this.userRepository.findOne({ id: payload.userId });
    if (!user) throw new UnauthorizedError(RES_MSG.INVALID("credentials"));

    const newPayload = this.buildPayload(user);

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
      throw new InternalServerError(RES_MSG.NO_TOKEN());

    await this.removeRefresh(payload.userId, payload.jti);
    await this.storeRefresh(
      newPayload.userId,
      newPayload.jti,
      tokens.refreshToken,
    );

    return tokens;
  }

  async revoke(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken, TokenType.REFRESH);
    if (!payload.jti)
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));

    await this.removeRefresh(payload.userId, payload.jti);
  }

  async revokeAll(userId: string): Promise<void> {
    await this.removeAllRefresh(userId);
  }
}
