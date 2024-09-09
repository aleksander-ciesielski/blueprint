import type { HttpContract } from "@blueprint/contracts";
import type { HttpContext } from "~/models/http/HttpContext";

export interface HttpGuard<TContract extends HttpContract<any, any>> {
  challenge(ctx: HttpContext<TContract>): Promise<void>;
}
