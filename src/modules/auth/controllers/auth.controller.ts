import { FastifyReply, FastifyRequest } from "fastify";
import { AuthServiceFactory } from "../factories/auth-service.factory";
import { CreateUserInput } from "../../user/schemas";
import { sendReply } from "../../../shared/utils/send-response";
import { ResponseCode } from "../../../shared/types/response-code";
import { LoginInput } from "../schemas/login.schema";
import { config } from "../../../config";

const MSG = {
  REGISTERED: "User registered successfully",
  LOGIN: "Logged in successfully",
  NO_REFRESH: "Refresh token not found",
  REFRESH: "Token refreshed successfully",
  LOGOUT: "Logged out successfully",
};

export class AuthController {
  private readonly authService = AuthServiceFactory.getInstance();

  /* POST /auth/register */
  register = async (
    req: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    await this.authService.register(req.body);
    return sendReply(reply, 201, ResponseCode.CREATED, null, MSG.REGISTERED);
  };

  /* POST /auth/login */
  login = async (
    req: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { accessToken, refreshToken } = await this.authService.login(
      req.body
    );

    reply.setCookie("refreshToken", refreshToken!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/auth",
      maxAge: Number(config.jwt.refreshExpiresIn) || 604_800,
    });

    return sendReply(reply, 200, ResponseCode.OK, { accessToken }, MSG.LOGIN);
  };

  /* POST /auth/refresh */
  refresh = async (
    req: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ): Promise<void> => {
    const refreshToken = reply.request.cookies.refreshToken;
    if (!refreshToken) throw new Error(MSG.NO_REFRESH);

    const { accessToken } = await this.authService.refresh(
      req.body.refreshToken
    );
    return sendReply(reply, 200, ResponseCode.OK, { accessToken }, MSG.REFRESH);
  };

  /* POST /auth/logout */
  logout = async (
    req: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ): Promise<void> => {
    const refreshToken = reply.request.cookies.refreshToken;
    if (refreshToken) await this.authService.revoke(refreshToken);
    reply.clearCookie("refreshToken");
    return sendReply(reply, 204, ResponseCode.NO_CONTENT, null, MSG.LOGOUT);
  };
}
