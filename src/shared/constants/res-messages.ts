export const MSG = {
  /* Success Messages */
  REGISTERED: "User registered successfully",
  LOGIN: "Logged in successfully",
  REFRESH: "Token refreshed successfully",
  LOGOUT: "Logged out successfully",
  UPDATED: "User updated successfully",
  DELETED: "User deleted successfully",
  ALL_USERS: "All users successfully retrieved",

  /* Error Messsages */
  NO_TOKEN: "Failed to generate refresh token",
  NO_REFRESH: "Refresh token not found",
  EMAIL: "Email already in use",
  USERNAME: "Username already in use",
  INVALID: "Invalid credentials",
  INV_REFRESH_TOKEN: "Invalid refresh token",
  NOT_FOUND: "User not found",
  NO_USERS: "No users found",
  FOUND: "User found",
  INCORRECT: "Current password incorrect",
  NO_MATCH: "New password cannot be the same as the current password",
} as const;
