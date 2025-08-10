import {
  createNormalizers,
  normalizeFields,
  toTrimLower,
  NormalizersMap,
} from "@/shared";
import { LoginInput } from "../schemas";

const loginMap: NormalizersMap<LoginInput> = {
  ...createNormalizers<{ identifier: string }>(["identifier"], toTrimLower),
};

export const normalizeLoginFields = (loginUser: LoginInput): LoginInput =>
  normalizeFields(loginUser, loginMap);
