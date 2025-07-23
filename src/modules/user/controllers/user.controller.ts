import { FastifyRequest, FastifyReply } from "fastify";
import { UserDto } from "../dtos/user.dto";
import { ResponseCode, sendReply, MSG } from "@/shared";
import { UpdatePasswordInput, UpdateUserInput } from "../schemas";
import { UserServiceFactory } from "../factories/user-service.factory";
import { AuthServiceFactory } from "@modules/auth/factories/auth-service.factory";
import { UserFilter } from "../domain/user-filter";

export class UserController {
  private readonly userService = UserServiceFactory.getInstance();
  private readonly authService = AuthServiceFactory.getInstance();

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

    const where: UserFilter = {
      ...(username && { username }),
      ...(email && { email }),
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

  /* PUT /users/:id/password  */
  updatePassword = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdatePasswordInput }>,
    res: FastifyReply
  ): Promise<void> => {
    await this.assertUserExists(req.params.id);
    await this.userService.updatePassword(req.params.id, req.body);
    await this.authService.revokeAll(req.params.id);
    return sendReply(res, 200, ResponseCode.OK, null, MSG.UPDATED);
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
