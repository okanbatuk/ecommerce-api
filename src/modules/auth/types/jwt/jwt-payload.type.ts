export type JwtPayload = {
  userId: string;
  email: string;
  username: string;
  jti?: string;
  iat?: number;
  exp?: number;
};
