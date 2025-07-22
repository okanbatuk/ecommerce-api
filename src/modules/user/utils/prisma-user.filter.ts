import { Prisma } from "@prisma/client";
import { UserFilter } from "../domain/user-filter";
import { caseInsensitive } from "@/shared/lib";

export const prismaUserFilter = (f: UserFilter): Prisma.UserWhereInput => ({
  ...(f.id && { id: f.id }),
  ...(f.email && { email: caseInsensitive(f.email) }),
  ...(f.username && { username: caseInsensitive(f.username) }),
});
