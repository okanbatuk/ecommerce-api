import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import {
  RES_MSG,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "@/shared";
import {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateUserInput,
} from "../schemas";
import { UserMapper } from "../mappers";
import { User, UserFilter } from "../domain";
import { UserDto } from "../dtos/user.dto";
import { BaseService } from "@/shared/services/base.service";
import { IUserRepository, IUserService } from "../interfaces";

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

    const user = await this.userRepository.findOne({ id });
    if (!user) throw new NotFoundError(RES_MSG.NOT_FOUND("User"));

    const isValid = await compare(currentPassword, user!.password);
    if (!isValid) throw new UnauthorizedError(RES_MSG.INCORRECT());

    const hashed = await hash(newPassword, 10);
    await this.userRepository.updatePassword(id, hashed);
  };
}
