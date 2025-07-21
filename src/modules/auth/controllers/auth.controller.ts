import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "@/config";
import { LoginInput } from "../schemas/login.schema";
import { CreateUserInput } from "@modules/user/schemas";
import { AuthServiceFactory } from "../factories/auth-service.factory";
import { MSG, sendReply, ResponseCode, UnauthorizedError } from "@/shared";

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
      // secure: true,
      sameSite: "lax",
      path: "/api/v1/auth",
      maxAge: Number(config.jwt.refreshExpiresIn) || 604_800,
    });

    return sendReply(reply, 200, ResponseCode.OK, { accessToken }, MSG.LOGIN);
  };

  /* POST /auth/refresh */
  refresh = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedError(MSG.NO_REFRESH);

    const tokens = await this.authService.refresh(refreshToken);

    reply.setCookie("refreshToken", tokens.refreshToken!, {
      httpOnly: true,
      // secure: true,
      sameSite: "lax",
      path: "/api/v1/auth",
      maxAge: Number(config.jwt.refreshExpiresIn) || 604_800,
    });

    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      { accessToken: tokens.accessToken },
      MSG.REFRESH
    );
  };

  /* POST /auth/logout */
  logout = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedError(MSG.NO_REFRESH);
    await this.authService.revoke(refreshToken);
    reply.clearCookie("refreshToken");
    return sendReply(reply, 204, ResponseCode.NO_CONTENT, null, MSG.LOGOUT);
  };
}
