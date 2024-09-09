import { instanceToPlain } from "class-transformer";
import type {
  HttpCodeOf, HttpContract, HttpResponsesOf, InstanceOf,
} from "@blueprint/contracts";
import type { Response } from "express";
import type { StatusCodes } from "http-status-codes";

export class Res<const TContract extends HttpContract<any, any>> {
  public constructor(
    public readonly contract: TContract,
    private readonly $response: Response,
  ) {}

  public send<TCode extends HttpCodeOf<TContract>>(
    code: TCode,
    body: InstanceOf<HttpResponsesOf<TContract>[TCode]>,
  ): void {
    if (body === undefined) {
      this.$response.status(code as TCode & StatusCodes).send();
      return;
    }

    this.$response.status(code as TCode & StatusCodes).json(instanceToPlain(body));
  }

  public sendBuffer<TCode extends HttpCodeOf<TContract>>(
    code: TCode & StatusCodes,
    mime: string,
    content: Buffer,
  ): void {
    this.$response
      .header("Content-Type", mime)
      .status(code)
      .end(content);
  }
}
