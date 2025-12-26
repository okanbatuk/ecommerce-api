import type { JwtPayload } from "@/modules/auth/types/jwt";
import { Role } from "@/shared";

export const userMock: JwtPayload = {
  userId: "1",
  username: "testuser",
  email: "test@example.com",
  deviceId: "device-1",
  role: Role.USER,
};
