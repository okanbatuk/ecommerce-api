import { User } from "../user.entity";

export type UserDto = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
