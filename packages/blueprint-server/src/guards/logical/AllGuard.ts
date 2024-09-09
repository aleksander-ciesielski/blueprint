import type { HttpContract } from "@blueprint/contracts";
import type { HttpGuard } from "~/guards/HttpGuard";
import type { HttpContext } from "~/models/http/HttpContext";

export class AllGuard<TContract extends HttpContract<any, any>> implements HttpGuard<TContract> {
  public constructor(private readonly guards: HttpGuard<TContract>[]) {}

  public async challenge(ctx: HttpContext<TContract>): Promise<void> {
    await Promise.all(this.guards.map((guard) => guard.challenge(ctx)));
  }
}
