export const TYPES = {
  // --- Controllers ---
  AuthController: Symbol.for("AuthController"),
  UserController: Symbol.for("UserController"),
  ProductController: Symbol.for("ProductController"),
  CategoryController: Symbol.for("CategoryController"),

  // --- Repositories ---
  UserRepository: Symbol.for("UserRepository"),
  ProductRepository: Symbol.for("ProductRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),

  // --- Services ---
  AuthService: Symbol.for("AuthService"),
  UserService: Symbol.for("UserService"),
  ProductService: Symbol.for("ProductService"),
  CategoryService: Symbol.for("CategoryService"),

  // --- Utility / Shared Services ---
  JwtService: Symbol.for("JwtService"),
  JwtConfig: Symbol.for("JwtConfig"),

  // --- Infra / Global ---
  PrismaClient: Symbol.for("PrismaClient"),
} as const;
