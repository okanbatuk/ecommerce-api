export const VAL_MSG = {
  /* Validation Messages */
  MIN: (field: string = "Field", minChar: number = 3) =>
    `${field} must be at least ${minChar} characters long.`,
  MAX: (field: string = "Field", maxChar: number = 50) =>
    `${field} can be at most ${maxChar} characters long.`,
  EMAIL: () => "Please enter a valid email address.",
  USERNAME: () =>
    "Username can only contain letters, numbers, and underscores.",
  PASSWORD: (field: string = "Password") =>
    `${field} must contain at least one uppercase letter, one lowercase letter, and one number.`,
  NO_MATCH: () =>
    "The new password cannot be the same as the current password.",
  PASSWD_REQ: (field: string = "current") =>
    `To update your password, you need to enter your ${field} password.`,
  UPDATE_REQ: () => "At least one field must be provided for update.",
} as const;
