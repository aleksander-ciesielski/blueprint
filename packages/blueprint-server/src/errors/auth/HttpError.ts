import type { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  public constructor(public readonly status: StatusCodes) {
    super();
  }
}
