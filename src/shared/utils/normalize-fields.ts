// Takes a value of type T and returns a value of the same type T.
// Example trimLower = (value:string) => value.trim().toLowerCase();
export type Normalizer<T> = (value: NonNullable<T>) => NonNullable<T>;

/**
 * Represents a map of keys from T to Normalizer functions. Each key in the map corresponds to a key in T, and the value is an optional Normalizer function for that key.
 *
 * - Example keys for User type: 'email', 'username'
 * - email: trimLower(User[email])
 */
export type NormalizersMap<T> = {
  [Key in keyof T]?: Normalizer<NonNullable<T[Key]>>;
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
  const output = {} as T;

  for (const key in input) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

    const value = input[key as keyof T];
    if (value == null) continue;

    const normalizer = normalizers[key as keyof T];

    output[key as keyof T] = normalizer
      ? normalizer(value as NonNullable<typeof value>)
      : value;
  }

  return output;
}
