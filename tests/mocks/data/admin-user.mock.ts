import type { JwtPayload } from "@/modules/auth/types/jwt";
import { Role } from "@/shared";

export const adminUserMock: JwtPayload = {
  userId: "2",
  username: "adminuser",
  email: "admin@example.com",
  deviceId: "device-2",
  role: Role.ADMIN,
};
