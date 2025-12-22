export class ConflictError extends Error {
  constructor(message: string = "Conflict occurred") {
    super(message);
    this.name = "ConflictError";
  }
}
