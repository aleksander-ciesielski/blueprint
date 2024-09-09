/* eslint-disable @typescript-eslint/indent */

import type { HttpContract as HttpContractType } from "@blueprint/contracts";
import type { Class, IsEqual } from "type-fest";
import type { HttpContext } from "~/models/http/HttpContext";
import type { HttpGuard } from "~/guards/HttpGuard";
import { HttpGuardFactory } from "~/services/http/HttpGuardFactory";
import { GLOBAL_CONTAINER } from "~/GLOBAL_CONTAINER";
import { HttpService } from "~/services/http/HttpService";

declare const INCOMPATIBLE_HTTP_CONTRACT_PARAMETER_TYPES: unique symbol;

type HttpContractDecoratorReturnType<
  TContract extends HttpContractType<any, any>,
  TTarget extends Record<keyof any, any>,
  TPropertyKey extends keyof TTarget,
> = (
  IsEqual<Parameters<TTarget[TPropertyKey]>, [HttpContext<TContract>]> extends true
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ? void
    : typeof INCOMPATIBLE_HTTP_CONTRACT_PARAMETER_TYPES
);

export function HttpContract<
  const TContract extends HttpContractType<any, any>,
  const TTarget extends Record<keyof any, any>,
  const TPropertyKey extends keyof TTarget,
>(contract: TContract, guard?: (factory: HttpGuardFactory) => HttpGuard<TContract>) {
  return (
    target: TTarget,
    propertyKey: TPropertyKey,
  ): HttpContractDecoratorReturnType<TContract, TTarget, TPropertyKey> => {
    const httpService = GLOBAL_CONTAINER.resolve(HttpService);
    httpService.registerContract(contract, async (ctx) => {
      const httpGuardFactory = GLOBAL_CONTAINER.resolve(HttpGuardFactory);
      await guard?.(httpGuardFactory)?.challenge(ctx);

      const controller = GLOBAL_CONTAINER.resolve(target.constructor as unknown as Class<TTarget>);
      const method = controller[propertyKey];

      await method.call(controller, ctx);
    });

    return undefined as unknown as HttpContractDecoratorReturnType<TContract, TTarget, TPropertyKey>;
  };
}
