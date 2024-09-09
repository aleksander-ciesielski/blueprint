import { injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import type { HttpHandler } from "~/handlers/HttpHandler";
import type { HttpContext } from "~/models/http/HttpContext";
import { Logger } from "~/logging/Logger";

@injectable()
export class InternalServerErrorHttpHandler implements HttpHandler {
  private readonly logger = Logger.for(InternalServerErrorHttpHandler.name);

  public async handle(
    ctx: HttpContext<any>,
    next: (ctx: HttpContext<any>) => Promise<void> | void,
  ): Promise<void> {
    try {
      return await next(ctx);
    } catch (e) {
      this.logger.error("Error during request processing.", { e });
      console.error(e);

      ctx.res.send(StatusCodes.INTERNAL_SERVER_ERROR, undefined);
    }
  }
}
