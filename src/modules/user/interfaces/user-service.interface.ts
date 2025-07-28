import { UserDto } from "../dtos/user.dto";
import { UserFilter } from "../domain/user-filter";
import { UpdatePasswordInput, UpdateUserInput } from "../schemas";
import { IService } from "@/shared/interfaces/service.interface";

export interface IUserService
  extends IService<UserDto, UpdateUserInput, UserFilter> {
  updatePassword(id: string, data: UpdatePasswordInput): Promise<void>;
}
