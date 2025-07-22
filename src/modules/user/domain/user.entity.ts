export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
};
