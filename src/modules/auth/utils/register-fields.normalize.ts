import { RegisterInput } from "@/modules/auth/schemas";
import {
  normalizeFields,
  toTrimLower,
  toTitleCase,
  type NormalizersMap,
} from "@/shared";

// Create a map object
const registerMap = (
  input: Partial<RegisterInput>,
): NormalizersMap<RegisterInput> => ({
  email: input.email ? toTrimLower : undefined,
  username: input.username ? toTrimLower : undefined,
  firstName: input.firstName ? toTitleCase : undefined,
  lastName: input.lastName ? toTitleCase : undefined,
});

export const normalizeRegisterFields = (
  registerUser: RegisterInput,
): RegisterInput => normalizeFields(registerUser, registerMap(registerUser));
