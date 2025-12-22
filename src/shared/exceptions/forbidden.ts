export class ForbiddenError extends Error {
  constructor(message: string = "Access forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
