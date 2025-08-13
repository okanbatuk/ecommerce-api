import { compare, hash } from "bcryptjs";
import {
  RES_MSG,
  Role,
  TokenType,
  UnauthorizedError,
  ConflictError,
} from "@/shared";
import { JwtPayload } from "../types/jwt";
import { TokenResponseDto } from "../dtos";
import { User } from "@/modules/user/domain";
import { logger, config, redis } from "@/config";
import { LoginInput, RegisterInput } from "../schemas";
import { IAuthService, IJwtService } from "../interfaces";
import { IUserRepository } from "@/modules/user/interfaces";
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
    if (byEmail || byUsername) {
      logger.warn(
        `[AuthService.register] Email or username conflict ` +
          `- email: ${email} - username: ${username}`,
      );

      throw new ConflictError(
        byEmail ? RES_MSG.DUPLICATE("Email") : RES_MSG.DUPLICATE("Username"),
      );
    }
  };

  private buildPayload = (
    deviceId: string,
    user: Pick<User, "id" | "email" | "username" | "role" | "tokenVersion">,
  ): JwtPayload => {
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
      deviceId,
      ver: user.tokenVersion,
    };
  };

  private redisKey = (userId: string, deviceId: string): string => {
    return `refresh:${userId}:${deviceId}`;
  };

  private storeRefresh = async (
    userId: string,
    deviceId: string,
    token: string,
  ) => {
    await redis.set(this.redisKey(userId, deviceId), token, "EX", REFRESH_TTL);
  };

  private removeRefresh = async (userId: string, deviceId: string) => {
    await redis.del(this.redisKey(userId, deviceId));
  };

  private removeAllRefresh = async (userId: string): Promise<void> => {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length) await redis.del(...keys);
  };

  async register(rawData: RegisterInput): Promise<void> {
    const refinedData = normalizeRegisterFields(rawData);
    const { email, username, password } = refinedData;
    logger.info(`[AuthService.register] email=${email}`);
    await this.assertUnique(email, username);
    const hashed = await hash(password, 10);
    await this.userRepository.create({
      ...refinedData,
      password: hashed,
      role: Role.USER,
    });
  }

  async login(
    rawData: LoginInput,
    deviceId: string,
  ): Promise<TokenResponseDto> {
    const { identifier, password } = normalizeLoginFields(rawData);
    logger.info(
      `[AuthService.login] user identifier=${identifier} deviceId=${deviceId}`,
    );
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user || !(await compare(password, user.password))) {
      logger.warn(
        `[AuthService.login] Invalid credentials identifier=${identifier}`,
      );
      throw new UnauthorizedError(RES_MSG.INVALID("credentials"));
    }

    const payload = this.buildPayload(deviceId, user);

    const tokens: TokenResponseDto = {
      accessToken: this.jwtService.sign(payload, TokenType.ACCESS),
      refreshToken: this.jwtService.sign(payload, TokenType.REFRESH),
    };

    await this.storeRefresh(
      payload.userId,
      payload.deviceId,
      tokens.refreshToken!,
    );
    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const payload = this.jwtService.verify(refreshToken, TokenType.REFRESH);
    const { userId, deviceId } = payload;
    if (!deviceId)
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));

    const key = this.redisKey(userId, deviceId);
    const stored = await redis.get(key);
    if (!stored || stored !== refreshToken) {
      logger.warn(
        `[AuthService.refresh] Device revoked userId=${userId} deviceId=${deviceId}`,
      );
      await this.removeAllRefresh(userId);
      let tokenVersion = await this.userRepository.getTokenVersion(userId);
      tokenVersion !== null &&
        (await this.userRepository.incrementTokenVersion(userId));
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));
    }

    const user = await this.userRepository.findOne({ id: userId });
    if (!user) throw new UnauthorizedError(RES_MSG.INVALID("credentials"));

    return {
      accessToken: this.jwtService.sign(payload, TokenType.ACCESS),
    };
  }

  async revoke(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken, TokenType.REFRESH);
    if (!payload.deviceId) {
      logger.warn(
        `[AuthService.revoke] Missing deviceId in refresh token. ` +
          `userId=${payload.userId}`,
      );
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));
    }

    await this.removeRefresh(payload.userId, payload.deviceId);
  }

  async revokeAll(userId: string): Promise<void> {
    logger.info(`[AuthService.revokeAll] userId=${userId}`);
    await this.removeAllRefresh(userId);
    let tokenVersion = await this.userRepository.getTokenVersion(userId);
    await this.userRepository.incrementTokenVersion(userId);
  }
}
