import { AddCategoryInput } from "../schemas";
import { capitalizeFirst, normalizeFields, NormalizersMap } from "@/shared";

const addMap = (input: AddCategoryInput): NormalizersMap<AddCategoryInput> => ({
  ...(input.name && { name: capitalizeFirst }),
});

export const normalizeAddFields = (
  addCategory: AddCategoryInput,
): AddCategoryInput => normalizeFields(addCategory, addMap(addCategory));
