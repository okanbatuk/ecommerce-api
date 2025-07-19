export type RefreshTokenPayloadDto = {
  sub: string; // User ID
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
  ver?: number; // Optional version for token invalidation
};
