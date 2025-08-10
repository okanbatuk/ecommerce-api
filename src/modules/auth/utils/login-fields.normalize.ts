import { normalizeFields, toTrimLower, NormalizersMap } from "@/shared";
import { LoginInput } from "../schemas";

const loginMap = (input: Partial<LoginInput>): NormalizersMap<LoginInput> => ({
  identifier: input.identifier ? toTrimLower : undefined,
});

export const normalizeLoginFields = (loginUser: LoginInput): LoginInput =>
  normalizeFields(loginUser, loginMap(loginUser));
