import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { config, jwtConfig, logger } from "@/config";
import { JwtService } from "../services/jwt.service";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../schemas";
import { ServiceFactory } from "@shared/factories/service.factory";
import { normalizeLoginFields, normalizeRegisterFields } from "../utils";
import { UserRepository } from "@modules/user/repositories/user.repository";
import { RES_MSG, sendReply, ResponseCode, UnauthorizedError } from "@/shared";

export class AuthController {
  private readonly authService = ServiceFactory.getInstance(
    AuthService,
    UserRepository,
    new JwtService(jwtConfig),
  );

  private setDidCookie = (reply: FastifyReply, deviceId: string): void => {
    reply.setCookie("did", deviceId, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 365 * 24 * 3600,
    });
  };

  private setRefreshCookie = (reply: FastifyReply, token: string): void => {
    reply.setCookie("refreshToken", token, {
      httpOnly: true,
      // secure: true,
      sameSite: "lax",
      path: "/api/v1/auth",
      maxAge: Number(config.jwt.refreshExpiresIn) || 604_800,
    });
  };

  private clearRefreshCookie = (reply: FastifyReply): void => {
    reply.clearCookie("refreshToken", { path: "/api/v1/auth" });
  };

  private extractToken = (req: FastifyRequest): string => {
    const token = req.cookies.refreshToken;
    if (!token) {
      logger.warn(`[AuthController.refresh] Token not found in cookies`);
      throw new UnauthorizedError(RES_MSG.NOT_FOUND("Refresh token"));
    }
    return token;
  };

  /* POST /auth/register */
  register = async (
    req: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    logger.info(
      `[AuthController.register] username: ${req.body.username} ` +
        `email: ${req.body.email}`,
    );
    await this.authService.register(req.body);
    return sendReply(
      reply,
      201,
      ResponseCode.CREATED,
      null,
      RES_MSG.REGISTERED(),
    );
  };

  /* POST /auth/login */
  login = async (
    req: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    logger.info(
      `[AuthController.login] user identifier: ${req.body.identifier}`,
    );
    const raw = req.headers["x-device=id"];
    const deviceId =
      (Array.isArray(raw) ? raw[0] : raw) ?? req.cookies.did ?? randomUUID();
    const { accessToken, refreshToken } = await this.authService.login(
      req.body,
      deviceId,
    );

    this.setDidCookie(reply, deviceId);
    this.setRefreshCookie(reply, refreshToken!);
    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      { accessToken },
      RES_MSG.LOGIN(),
    );
  };

  /* POST /auth/refresh */
  refresh = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    logger.info(`[AuthController.refresh]`);

    const refreshToken = this.extractToken(req);
    const { accessToken } = await this.authService.refresh(refreshToken);

    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      { accessToken },
      RES_MSG.REFRESH(),
    );
  };

  /* POST /auth/logout */
  logout = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const refreshToken = this.extractToken(req);
    this.clearRefreshCookie(reply);
    await this.authService.revoke(refreshToken);
    return sendReply(
      reply,
      200,
      ResponseCode.NO_CONTENT,
      null,
      RES_MSG.LOGOUT(),
    );
  };
}
