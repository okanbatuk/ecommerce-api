import { Normalizer } from "../utils";

export const capitalizeFirst: Normalizer<string> = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
