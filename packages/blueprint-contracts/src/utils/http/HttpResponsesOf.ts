import type { HttpContract } from "~/contracts/http/HttpContract";

export type HttpResponsesOf<TContract> = (
  TContract extends HttpContract<any, infer TResponses>
    ? TResponses
    : never
);
