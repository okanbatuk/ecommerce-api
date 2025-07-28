import { FastifyReply, FastifyRequest } from "fastify";
import { config, jwtConfig } from "@/config";
import { JwtService } from "../services/jwt.service";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../schemas";
import { ServiceFactory } from "@shared/factories/service.factory";
import { UserRepository } from "@modules/user/repositories/user.repository";
import { MSG, sendReply, ResponseCode, UnauthorizedError } from "@/shared";

export class AuthController {
  private readonly authService = ServiceFactory.getInstance(
    AuthService,
    UserRepository,
    new JwtService(jwtConfig),
  );

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
    if (!token) throw new UnauthorizedError(MSG.NO_REFRESH);
    return token;
  };

  /* POST /auth/register */
  register = async (
    req: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.authService.register(req.body);
    return sendReply(reply, 201, ResponseCode.CREATED, null, MSG.REGISTERED);
  };

  /* POST /auth/login */
  login = async (
    req: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { accessToken, refreshToken } = await this.authService.login(
      req.body,
    );
    this.setRefreshCookie(reply, refreshToken!);
    return sendReply(reply, 200, ResponseCode.OK, { accessToken }, MSG.LOGIN);
  };

  /* POST /auth/refresh */
  refresh = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const refreshToken = this.extractToken(req);
    if (!refreshToken) throw new UnauthorizedError(MSG.NO_REFRESH);

    const tokens = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(reply, tokens.refreshToken!);

    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      { accessToken: tokens.accessToken },
      MSG.REFRESH,
    );
  };

  /* POST /auth/logout */
  logout = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const refreshToken = this.extractToken(req);
    if (!refreshToken) throw new UnauthorizedError(MSG.NO_REFRESH);
    await this.authService.revoke(refreshToken);
    this.clearRefreshCookie(reply);
    return sendReply(reply, 204, ResponseCode.NO_CONTENT, null, MSG.LOGOUT);
  };
}
