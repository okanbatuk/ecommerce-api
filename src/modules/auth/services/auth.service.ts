import { compare, hash } from "bcryptjs";
import { TokenResponseDto } from "../dtos";
import { User } from "../../user/user.entity";
import { CreateUserInput } from "../../user/schemas";
import { LoginInput } from "../schemas/login.schema";
import { logger, config, redis } from "../../../config";
import { JwtPayload } from "../types/jwt/jwt-payload.type";
import { IJwtService } from "../interfaces/jwt-service.interface";
import { IAuthService } from "../interfaces/auth-service.interface";
import { IUserRepository } from "../../user/interfaces/user-repository.interface";
import {
  InternalServerError,
  UnauthorizedError,
} from "../../../shared/exceptions";
import { normalizeFields } from "../../../shared/utils/normalize-fields";

const REFRESH_TTL = Number(config.jwt.refreshExpiresIn) || 604_800;

const MSG = {
  EMAIL: "Email already in use",
  USERNAME: "Username already in use",
  REFRESH_TOKEN: "Invalid refresh token",
};

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
      throw new UnauthorizedError("Invalid credentials");

    const payload = this.payload(user);

    const tokens: TokenResponseDto = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, "refresh"),
    };
    if (!tokens.accessToken || !tokens.refreshToken || !payload.jti)
      throw new InternalServerError("Failed to generate refresh token");

    await redis.set(
      this.redisKey(payload.userId, payload.jti),
      tokens.refreshToken,
      "EX",
      REFRESH_TTL
    );

    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const payload = this.jwtService.verify(refreshToken, "refresh");
    if (!payload.jti) throw new UnauthorizedError(MSG.REFRESH_TOKEN);

    const key = this.redisKey(payload.userId, payload.jti);
    const token = await redis.get(key);
    if (!token || token !== refreshToken) {
      await this.revokeAll(payload.userId);
      logger.warn(`Possible token hijack - user ${payload.userId}`);
      throw new UnauthorizedError(MSG.REFRESH_TOKEN);
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) throw new UnauthorizedError(MSG.REFRESH_TOKEN);

    const newPayload = this.payload(user);
    return {
      accessToken: this.jwtService.sign(newPayload),
    };
  }

  async revoke(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken, "refresh");
    if (!payload.jti) throw new UnauthorizedError(MSG.REFRESH_TOKEN);
    const key = this.redisKey(payload.userId, payload.jti);
    await redis.del(key);
  }

  async revokeAll(userId: string): Promise<void> {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length) await Promise.all(keys.map((key) => redis.del(key)));
  }
}
