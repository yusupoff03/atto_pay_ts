export class CustomError extends Error {
  public info: string | undefined; // Specify the type for 'info'

  constructor(name: string, originalMessage?: string, info?: string) {
    super(originalMessage || name);

    this.name = name;
    this.info = info || undefined; // Set 'info' explicitly as undefined if not provided
  }
}
