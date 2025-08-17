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

  /* PUT /users/:id */
  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    return this.updateCore(req, res, normalizeUpdateFields);
  };

  /* PUT /users/:id/password  */
  updatePassword = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdatePasswordInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.assertExists(req.params.id, req.user.role === Role.ADMIN);
    await this.service.updatePassword(req.params.id, req.body);
    await this.authService.revokeAll(req.params.id);
    return this.updated(res, "User");
  };

  /* DELETE /users/:id */
  remove = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.removeCore(req, res);
    await this.authService.revokeAll(req.params.id);
    return this.noContent(res, "User");
  };
}
