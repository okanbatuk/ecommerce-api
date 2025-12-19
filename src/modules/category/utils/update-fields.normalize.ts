import { UpdateCategoryInput } from "../schemas";
import { capitalizeFirst, normalizeFields, NormalizersMap } from "@/shared";

const updateMap = (
  input: UpdateCategoryInput,
): NormalizersMap<UpdateCategoryInput> => ({
  ...(input.name && { name: capitalizeFirst }),
});

export const normalizeUpdateFields = (
  update: UpdateCategoryInput,
): UpdateCategoryInput => normalizeFields(update, updateMap(update));
