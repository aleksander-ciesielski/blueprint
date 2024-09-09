import type { HttpContract } from "@blueprint/contracts";
import type { HttpGuard as HttpGuardInterface } from "~/guards/HttpGuard";
import type { HttpContext } from "~/models/http/HttpContext";
import { HttpGuardFactory } from "~/services/http/HttpGuardFactory";
import { GLOBAL_CONTAINER } from "~/GLOBAL_CONTAINER";

export function HttpGuard<TContract extends HttpContract<any, any>>(
  factory: (factory: HttpGuardFactory) => HttpGuardInterface<TContract>,
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign, func-names
    descriptor.value = async function (ctx: HttpContext<TContract>) {
      const guard = factory(GLOBAL_CONTAINER.resolve(HttpGuardFactory));
      await guard.challenge(ctx);

      return originalMethod.apply(target, ctx);
    };

    return descriptor;
  };
}
