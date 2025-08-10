import { RegisterInput } from "@/modules/auth/schemas";
import {
  createNormalizers,
  normalizeFields,
  toTrimLower,
  toTitleCase,
  type NormalizersMap,
} from "@/shared";

// Generate keys for the normalizer
const mainKeys = ["email", "username"] as const;
const subKeys = ["firstName", "lastName"] as const;

// Create a map object
const registerMap: NormalizersMap<RegisterInput> = {
  ...createNormalizers<Pick<RegisterInput, "email" | "username">>(
    mainKeys,
    toTrimLower,
  ),
  ...createNormalizers<Pick<RegisterInput, "firstName" | "lastName">>(
    subKeys,
    toTitleCase,
  ),
};

export const normalizeRegisterFields = (
  registerUser: RegisterInput,
): RegisterInput => normalizeFields(registerUser, registerMap);
