import type { HttpContract } from "~/contracts/http/HttpContract";

export type HttpRequestOf<TContract> = (
  TContract extends HttpContract<infer TRequest, any>
    ? TRequest
    : never
);
