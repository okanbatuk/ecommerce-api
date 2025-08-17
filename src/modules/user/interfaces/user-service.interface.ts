import type { UserFilter } from "../domain";
import type { UserDto } from "../dtos/user.dto";
import type { IService } from "@/shared/interfaces/service.interface";
import type { UpdatePasswordInput, UpdateUserInput } from "../schemas";

export interface IUserService
  extends IService<UserDto, UpdateUserInput, UserFilter> {
  updatePassword(id: string, data: UpdatePasswordInput): Promise<void>;
}
