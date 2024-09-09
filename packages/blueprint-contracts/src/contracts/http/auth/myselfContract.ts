/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export class MyselfOkResponse {
  public constructor(
    public readonly username: string | undefined,
    public readonly userId: string | undefined,
  ) {}
}

export const myselfContract = httpContract({
  method: HttpMethod.GET,
  path: "/auth",
  protection: AuthProtection.None,
  credentials: Credentials.AccessToken,
  request: undefined,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.OK]: MyselfOkResponse,
  },
});
