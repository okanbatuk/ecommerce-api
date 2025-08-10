import {
  toTitleCase,
  toTrimLower,
  normalizeFields,
  NormalizersMap,
} from "@/shared";
import { UpdateUserInput } from "../schemas";

const updateMap = (
  input: Partial<UpdateUserInput>,
): NormalizersMap<UpdateUserInput> => ({
  username: input.username ? toTrimLower : undefined,
  firstName: input.firstName ? toTitleCase : undefined,
  lastName: input.lastName ? toTitleCase : undefined,
});

export const normalizeUpdateFields = (
  updateUser: UpdateUserInput,
): UpdateUserInput => normalizeFields(updateUser, updateMap(updateUser));
