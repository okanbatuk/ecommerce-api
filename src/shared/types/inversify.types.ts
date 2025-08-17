export const TYPES = {
  // --- Controllers ---
  AuthController: Symbol.for("AuthController"),
  UserController: Symbol.for("UserController"),
  ProductController: Symbol.for("ProductController"),

  // --- Repositories ---
  UserRepository: Symbol.for("UserRepository"),
  ProductRepository: Symbol.for("ProductRepository"),

  // --- Services ---
  AuthService: Symbol.for("AuthService"),
  UserService: Symbol.for("UserService"),
  ProductService: Symbol.for("ProductService"),

  // --- Utility / Shared Services ---
  JwtService: Symbol.for("JwtService"),
  JwtConfig: Symbol.for("JwtConfig"),

  // --- Infra / Global ---
  PrismaClient: Symbol.for("PrismaClient"),
} as const;
