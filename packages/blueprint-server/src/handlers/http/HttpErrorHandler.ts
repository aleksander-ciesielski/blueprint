import { injectable } from "tsyringe";
import type { HttpHandler } from "~/handlers/HttpHandler";
import type { HttpContext } from "~/models/http/HttpContext";
import { HttpError } from "~/errors/auth/HttpError";

@injectable()
export class HttpErrorHandler implements HttpHandler {
  // eslint-disable-next-line class-methods-use-this
  public async handle(
    ctx: HttpContext<any>,
    next: (ctx: HttpContext<any>) => Promise<void> | void,
  ): Promise<void> {
    try {
      return await next(ctx);
    } catch (e) {
      if (e instanceof HttpError) {
        return ctx.res.send(e.status, undefined);
      }

      throw e;
    }
  }
}
