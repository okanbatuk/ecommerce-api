import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { User } from "../user.entity";
import { UserDto } from "../dtos/user.dto";
import { UserMapper } from "../mappers/user.mapper";
import {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateUserInput,
} from "../schemas";
import { IUserService } from "../interfaces/user-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../shared/exceptions";
import { normalizeFields } from "../../../shared/utils/normalize-fields";

const MSG = {
  NOT_FOUND: "User not found",
  NO_USERS: "No users found",
  INCORRECT: "Current password incorrect",
  NO_MATCH: "New password cannot be the same as the current password",
} as const;

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

  async getUser(where: Prisma.UserWhereInput): Promise<UserDto> {
    const user = await this.userRepository.findOne(where);
    if (!user) throw new NotFoundError(MSG.NOT_FOUND);
    return this.toDto(user);
  }

  async createUser(data: CreateUserInput): Promise<UserDto> {
    const normalizedData = normalizeFields(data);
    const user = await this.userRepository.create(normalizedData);
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
