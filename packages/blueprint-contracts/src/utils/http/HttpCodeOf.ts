import type { HttpContract } from "~/contracts/http/HttpContract";

export type HttpCodeOf<TContract> = (
  TContract extends HttpContract<any, infer TResponses>
    ? keyof TResponses
    : never
);
