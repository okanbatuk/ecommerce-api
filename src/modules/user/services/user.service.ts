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
import { UpdatePasswordInput, UpdateUserInput } from "../schemas";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  private toDto = (u: User) => UserMapper.toDto(u);

  async getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[]> {
    const users = await this.userRepository.findAll({ limit, offset });
    if (users.length === 0) throw new NotFoundError(MSG.NO_USERS);
    return users.map(this.toDto);
  }

  async getUser(filter: UserFilter): Promise<UserDto> {
    const user = await this.userRepository.findOne(filter);
    if (!user) throw new NotFoundError(MSG.NOT_FOUND);
    return this.toDto(user);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDto> {
    const normalizedData = normalizeFields(data);
    const user = await this.userRepository.update(id, normalizedData);

    return this.toDto(user);
  }

  async updatePassword(id: string, data: UpdatePasswordInput): Promise<void> {
    const { currentPassword, newPassword } = data;
    if (currentPassword === newPassword)
      throw new BadRequestError(MSG.NO_MATCH);

    const user = await this.userRepository.findOne({ id });
    if (!user) throw new NotFoundError(MSG.NOT_FOUND);

    const isValid = await compare(currentPassword, user!.password);
    if (!isValid) throw new UnauthorizedError(MSG.INCORRECT);

    const hashed = await hash(newPassword, 10);
    await this.userRepository.updatePassword(id, hashed);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
