import { StatusCodes } from "http-status-codes";
import type { HttpContract } from "@blueprint/contracts";
import type { HttpGuard } from "~/guards/HttpGuard";
import type { HttpContext } from "~/models/http/HttpContext";
import { HttpError } from "~/errors/auth/HttpError";

export class SomeGuard<TContract extends HttpContract<any, any>> implements HttpGuard<TContract> {
  private static async passes<TContract extends HttpContract<any, any>>(
    ctx: HttpContext<TContract>,
    guard: HttpGuard<TContract>,
  ): Promise<boolean> {
    try {
      await guard.challenge(ctx);
      return true;
    } catch (e) {
      return false;
    }
  }

  public constructor(private readonly guards: HttpGuard<TContract>[]) {}

  public async challenge(ctx: HttpContext<TContract>): Promise<void> {
    const statuses = await Promise.all(this.guards.map((guard) => SomeGuard.passes(ctx, guard)));
    if (!statuses.includes(true)) {
      throw new HttpError(StatusCodes.FORBIDDEN);
    }
  }
}
