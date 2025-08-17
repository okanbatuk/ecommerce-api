import { inject, injectable } from "inversify";
import { FastifyRequest, FastifyReply } from "fastify";
import { normalizeUpdateFields } from "../utils";
import { TYPES, Role, BaseController } from "@/shared";

import type { UserFilter } from "../domain";
import type { UserDto } from "../dtos/user.dto";
import type { IUserService } from "../interfaces";
import type { UpdatePasswordInput, UpdateUserInput } from "../schemas";
import type { IAuthService } from "@/modules/auth/interfaces/auth-service.interface";

@injectable()
export class UserController extends BaseController<
  UserDto,
  UpdateUserInput,
  UserFilter,
  IUserService
> {
  constructor(
    @inject(TYPES.UserService) userService: IUserService,
    @inject(TYPES.AuthService) private readonly authService: IAuthService,
  ) {
    super(userService);
  }
  /* GET /users/:id */
  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const user = await this.assertUserExists(req.params.id);

    return sendReply(reply, 200, ResponseCode.OK, user, RES_MSG.FOUND("User"));
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
    res: FastifyReply,
  ): Promise<void> => {
    const { username, email, limit = 20, offset = 0 } = req.query;

    const where: UserFilter = {
      ...(username && { username }),
      ...(email && { email }),
    };

    const hasFilter = Object.keys(where).length > 0;

    const result = hasFilter
      ? await this.userService.findMany(where, { limit, offset })
      : await this.userService.findAll({ limit, offset });

    return sendReply(res, 200, ResponseCode.OK, result, RES_MSG.ALL("Users"));
  };

  /* PUT /users/:id */
  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.assertUserExists(req.params.id);

    const refinedData = normalizeUpdateFields(req.body);
    const updatedUser = await this.userService.update(
      req.params.id,
      refinedData,
    );
    return sendReply(
      res,
      200,
      ResponseCode.OK,
      updatedUser,
      RES_MSG.UPDATED("User"),
    );
  };

  /* PUT /users/:id/password  */
  updatePassword = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdatePasswordInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.assertUserExists(req.params.id);
    await this.userService.updatePassword(req.params.id, req.body);
    await this.authService.revokeAll(req.params.id);
    return sendReply(
      res,
      200,
      ResponseCode.NO_CONTENT,
      null,
      RES_MSG.UPDATED("User"),
    );
  };

  /* DELETE /users/:id */
  remove = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    const { id } = req.params;
    await this.assertUserExists(id);

    await this.userService.delete(id);
    await this.authService.revokeAll(id);
    return sendReply(
      res,
      200,
      ResponseCode.NO_CONTENT,
      null,
      RES_MSG.DELETED("User"),
    );
  };
}
