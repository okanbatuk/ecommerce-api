import { compare, hash } from "bcryptjs";
import { inject, injectable } from "inversify";
import { UserMapper } from "../mappers";
import { BaseService } from "@/shared/services/base.service";
import { RES_MSG, NotFoundError, UnauthorizedError, TYPES } from "@/shared";

import type {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateUserInput,
  UserSearchQueryType,
} from "../schemas";
import type { UserDto } from "../dtos/user.dto";
import type { User, UserFilter } from "../domain";
import type { IUserRepository } from "../interfaces/user-repository.interface";
import type { IUserService } from "../interfaces/user-service.interface";

@injectable()
export class UserService
  extends BaseService<
    UserDto,
    User,
    CreateUserInput,
    UpdateUserInput,
    UserFilter,
    IUserRepository
  >
  implements IUserService
{
  constructor(
    @inject(TYPES.UserRepository)
    userRepository: IUserRepository,
  ) {
    super(userRepository);
  }

  protected toDto = (u: User) => UserMapper.toDto(u);

  updatePassword = async (
    id: string,
    data: UpdatePasswordInput,
  ): Promise<void> => {
    const { currentPassword, newPassword } = data;

    const user = await this.repository.findOne({ id });
    if (!user) throw new NotFoundError(RES_MSG.NOT_FOUND("User"));

    const isValid = await compare(currentPassword, user!.password);
    if (!isValid) throw new UnauthorizedError(RES_MSG.INCORRECT());

    const hashed = await hash(newPassword, 10);
    await this.repository.updatePassword(id, hashed);
  };
}
