import type { HttpMethod } from "@blueprint/common";
import type { StatusCodes } from "http-status-codes";
import type { Constructor } from "type-fest";
import type { AuthProtection } from "~/AuthProtection";
import type { Credentials } from "~/types/auth/Credentials";
import type { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export interface HttpContract<
  TRequest extends undefined | Constructor<unknown>,
  TResponses extends Partial<Record<StatusCodes, unknown>>,
> {
  method: HttpMethod;
  path: string;
  protection: AuthProtection;
  credentials: Credentials;
  request: TRequest;
  type: HttpPayloadType;
  responses: TResponses;
}

export function httpContract<
  TRequest extends undefined | Constructor<unknown>,
  TResponses extends Partial<Record<StatusCodes, unknown>>,
>(contract: HttpContract<TRequest, TResponses>): HttpContract<TRequest, TResponses> {
  return contract;
}
