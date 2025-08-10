import { Normalizer, NormalizersMap } from "./normalize-fields";

/**
 * @returns
 * result = {
 *  email: trimLower,
 *  username:trimLower
 * }
 */
export const createNormalizers = <T>(
  keys: readonly (keyof T)[],
  normalizer: Normalizer<T[keyof T]>,
): NormalizersMap<T> =>
  keys.reduce((acc, key) => {
    acc[key] = normalizer;
    return acc;
    // its an initial value as NormalizersMap<T>
  }, {} as NormalizersMap<T>);
