import { slugify } from "@shared/utils";

export function buildCategorySlug(name: string, parentSlug?: string): string {
  const self = slugify(name);
  return parentSlug ? `${parentSlug}-${self}` : self;
}
