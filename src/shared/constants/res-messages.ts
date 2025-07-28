export const MSG = {
  /* Success Messages */
  REGISTERED: () => "User registered successfully",
  LOGIN: () => "Logged in successfully",
  REFRESH: () => "Token refreshed successfully",
  LOGOUT: () => "Logged out successfully",
  UPDATED: (entity: string = "Resource") => `${entity} updated successfully`,
  DELETED: (entity: string = "Resource") => `${entity} deleted successfully`,
  ALL: (entity: string = "Resource") => `All ${entity} successfully retrieved`,
  FOUND: (entity: string = "Resource") => `${entity} successfully found.`,

  /* Error Messsages */
  NO_TOKEN: () => "Failed to generate refresh token",
  NOT_FOUND: (entity: string = "Resource") => `${entity} not found`,
  DUPLICATE: (field: string = "Field") => `${field} already in use`,
  INVALID: (field: string = "field") => `Invalid ${field}`,
  INCORRECT: () => "Current password incorrect",
  NO_MATCH: () => "New password cannot be the same as the current password",
} as const;
