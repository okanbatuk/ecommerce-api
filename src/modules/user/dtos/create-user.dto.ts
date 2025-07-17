import { User } from "../user.entity";

export type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt">;
