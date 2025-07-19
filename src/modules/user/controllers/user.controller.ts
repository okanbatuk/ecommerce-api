import { Prisma } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserDto } from "../dtos/user.dto";
import { UpdateUserInput } from "../schemas";
import { sendReply } from "../../../shared/utils/send-response";
import { ResponseCode } from "../../../shared/types/response-code";
import { UserServiceFactory } from "../factories/user-service.factory";

const MSG = {
  NOT_FOUND: "User not found",
  NO_USERS: "No users found",
  UPDATED: "User updated successfully",
  DELETED: "User deleted successfully",
  ALL_USERS: "All users successfully retrieved",
  FOUND: "User found",
} as const;

export class UserController {
  private readonly userService = UserServiceFactory.getInstance();

  private async assertUserExists(id: string): Promise<UserDto> {
    const user = await this.userService.getUser({ id });
    return user;
  }
  /* GET /users/:id */
  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> => {
    const user = await this.assertUserExists(req.params.id);

    return sendReply(reply, 200, ResponseCode.OK, user, MSG.FOUND);
  };

  /* GET /users?username=foo&email=bar@x.com&limit=20&offset=0 */
  search = async (
    req: FastifyRequest<{
      Querystring: {
        username?: string;
        email?: string;
        limit?: number;
        offset?: number;
      };
    }>,
    res: FastifyReply
  ): Promise<void> => {
    const { username, email, limit = 20, offset = 0 } = req.query;

    const where: Prisma.UserWhereInput = {
      ...(username && {
        username: { contains: username, mode: "insensitive" },
      }),
      ...(email && { email: { contains: email, mode: "insensitive" } }),
    };

    const hasFilter = Object.keys(where).length > 0;

    const result = hasFilter
      ? await this.userService.getUser(where)
      : await this.userService.getAllUsers({ limit, offset });

    return sendReply(
      res,
      200,
      ResponseCode.OK,
      result,
      hasFilter ? MSG.FOUND : MSG.ALL_USERS
    );
  };

  /* PUT /users/:id */
  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
    res: FastifyReply
  ): Promise<void> => {
    await this.assertUserExists(req.params.id);

    const updatedUser = await this.userService.updateUser(
      req.params.id,
      req.body
    );
    return sendReply(res, 200, ResponseCode.OK, updatedUser, MSG.UPDATED);
  };

  /* DELETE /users/:id */
  remove = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ): Promise<void> => {
    await this.assertUserExists(req.params.id);

    await this.userService.deleteUser(req.params.id);
    return sendReply(res, 204, ResponseCode.NO_CONTENT, null, MSG.DELETED);
  };
}
