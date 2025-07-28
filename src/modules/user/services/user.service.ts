import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import {
  MSG,
  normalizeFields,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "@/shared";
import { UserDto } from "../dtos/user.dto";
import { User } from "../domain/user.entity";
import { UserFilter } from "../domain/user-filter";
import { UserMapper } from "../mappers/user-dto.mapper";
import { IUserRepository, IUserService } from "../interfaces";
import {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateUserInput,
} from "../schemas";
import { BaseService } from "@/shared/services/base.service";

export class UserService
  extends BaseService<
    UserDto,
    User,
    CreateUserInput,
    UpdateUserInput,
    UserFilter
  >
  implements IUserService
{
  constructor(private readonly userRepository: IUserRepository) {
    super(userRepository);
  }

  protected toDto = (u: User) => UserMapper.toDto(u);

  updatePassword = async (
    id: string,
    data: UpdatePasswordInput,
  ): Promise<void> => {
    const { currentPassword, newPassword } = data;
    if (currentPassword === newPassword)
      throw new BadRequestError(MSG.NO_MATCH());

    const user = await this.userRepository.findOne({ id });
    if (!user) throw new NotFoundError(MSG.NOT_FOUND("User"));

    const isValid = await compare(currentPassword, user!.password);
    if (!isValid) throw new UnauthorizedError(MSG.INCORRECT());

    const hashed = await hash(newPassword, 10);
    await this.userRepository.updatePassword(id, hashed);
  };
}
