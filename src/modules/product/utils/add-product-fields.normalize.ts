import {
  capitalizeFirst,
  normalizeFields,
  toTitleCase,
  NormalizersMap,
} from "@/shared";
import { AddProductInput } from "../schemas";

const addMap = (input: AddProductInput): NormalizersMap<AddProductInput> => {
  return {
    ...(input.name && { name: toTitleCase }),
    ...(input.description && { description: capitalizeFirst }),
  };
};

export const normalizeAddFields = (
  addProduct: AddProductInput,
): AddProductInput => normalizeFields(addProduct, addMap(addProduct));
