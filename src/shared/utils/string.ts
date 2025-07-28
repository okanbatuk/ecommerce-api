export const uncapitalize = <S extends string>(s: S): Uncapitalize<S> =>
  (s.charAt(0).toLowerCase() + s.slice(1)) as Uncapitalize<S>;
