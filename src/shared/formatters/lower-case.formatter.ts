import { Normalizer } from "../utils";

export const toTrimLower: Normalizer<string> = (str: string): string =>
  str.trim().toLowerCase();
