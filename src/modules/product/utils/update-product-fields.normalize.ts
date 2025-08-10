import {
  capitalizeFirst,
  toTrimLower,
  toTitleCase,
  NormalizersMap,
  normalizeFields,
} from "@/shared";
import { UpdateProductInput } from "../schemas/update-product.schema";

const updateMap = (
  input: Partial<UpdateProductInput>,
): NormalizersMap<UpdateProductInput> => {
  return {
    ...(input.name && { name: toTitleCase }),
    ...(input.slug && { slug: toTrimLower }),
    ...(input.description && { description: capitalizeFirst }),
  };
};

export const normalizeUpdateFields = (
  updateProduct: UpdateProductInput,
): UpdateProductInput =>
  normalizeFields(updateProduct, updateMap(updateProduct));
