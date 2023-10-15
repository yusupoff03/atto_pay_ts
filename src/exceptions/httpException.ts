export class HttpException extends Error {
  public status: number;
  public info: undefined;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
