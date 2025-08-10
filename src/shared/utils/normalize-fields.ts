// Takes a value of type T and returns a value of the same type T.
// Example trimLower = (value:string) => value.trim().toLowerCase();
export type Normalizer<T> = (value: T) => T;

/**
 * Represents a map of keys from T to Normalizer functions. Each key in the map corresponds to a key in T, and the value is an optional Normalizer function for that key.
 *
 * - Example keys for User type: 'email', 'username'
 * - email: trimLower(User[email])
 */
export type NormalizersMap<T> = {
  [Key in keyof T]?: Normalizer<T[Key]>;
};

/**
 * normalizeFields:
 * - Takes an input object and a map of normalizers.
 * - Applies each normalizer to the corresponding field if present.
 * - Returns a new object with normalized fields.
 */
export function normalizeFields<T>(
  input: T,
  normalizers: NormalizersMap<T>,
): T {
  const output = { ...input };

  for (let key in normalizers) {
    const normalizer = normalizers[key];
    if (input[key] !== undefined && normalizer) {
      output[key] = normalizer(input[key]);
    }
  }

  return output;
}
