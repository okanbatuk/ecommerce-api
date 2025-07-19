export class InternalServerError extends Error {
  constructor(message: string = "Internal server error") {
    super(message);
    this.name = "InternalServerError";
  }
}
