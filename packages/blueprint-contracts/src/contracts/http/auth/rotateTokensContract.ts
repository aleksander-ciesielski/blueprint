/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export class RotateTokensOkResponse {
  public constructor(
    public readonly refreshToken: string,
    public readonly accessToken: string,
  ) {}
}

export const rotateTokensContract = httpContract({
  method: HttpMethod.PUT,
  path: "/auth",
  protection: AuthProtection.None,
  credentials: Credentials.RefreshToken,
  request: undefined,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.OK]: RotateTokensOkResponse,
    [StatusCodes.UNAUTHORIZED]: undefined,
  },
});
