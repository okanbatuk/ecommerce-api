import {
  createNormalizers,
  toTitleCase,
  toTrimLower,
  normalizeFields,
  NormalizersMap,
} from "@/shared";
import { UpdateUserInput } from "../schemas";

const keys = ["firstName", "lastName"] as const;

const updateMap: NormalizersMap<UpdateUserInput> = {
  ...createNormalizers<{ username: string }>(["username"], toTrimLower),
  ...createNormalizers<{ firstName: string; lastName: string }>(
    keys,
    toTitleCase,
  ),
};

export const normalizeUpdateFields = (
  updateUser: UpdateUserInput,
): UpdateUserInput => normalizeFields(updateUser, updateMap);
