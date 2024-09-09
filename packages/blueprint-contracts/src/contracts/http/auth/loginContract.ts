/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export enum LoginErrorCode {
  UserNotFound = "USER_NOT_FOUND",
  InvalidPassword = "INVALID_PASSWORD",
}

export class LoginRequest {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class LoginOkResponse {
  public constructor(
    public readonly refreshToken: string,
    public readonly accessToken: string,
  ) {}
}

export class LoginUnauthorizedResponse {
  public constructor(
    public readonly errors: LoginErrorCode[],
  ) {}
}

export const loginContract = httpContract({
  method: HttpMethod.POST,
  path: "/auth",
  protection: AuthProtection.None,
  credentials: Credentials.None,
  request: LoginRequest,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.OK]: LoginOkResponse,
    [StatusCodes.UNAUTHORIZED]: LoginUnauthorizedResponse,
  },
});
