import { Normalizer } from "../utils";

export const toTitleCase: Normalizer<string> = (str: string): string =>
  str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
