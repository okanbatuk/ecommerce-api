import { CreateUserInput } from "@/modules/user/schemas";

type NormalizeFields = Pick<
  CreateUserInput,
  "email" | "username" | "firstName" | "lastName" | "role"
>;

export const normalizeFields = <T extends Partial<NormalizeFields>>(
  input: T
): T => {
  return {
    ...input,
    email: input.email?.trim().toLowerCase(),
    username: input.username?.trim().toLowerCase(),
    ...(input.firstName && { firstName: toTitleCase(input.firstName.trim()) }),
    ...(input.lastName && { lastName: toTitleCase(input.lastName.trim()) }),
  };
};

const toTitleCase = (str: string): string =>
  str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
