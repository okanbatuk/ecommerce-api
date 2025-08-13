export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "USER";
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
};
