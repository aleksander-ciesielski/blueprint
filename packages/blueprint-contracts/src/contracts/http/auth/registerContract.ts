/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export enum RegisterErrorCode {
  EmailInUse = "EMAIL_IN_USE",
  NameTooShort = "NAME_TOO_SHORT",
  NameTooLong = "NAME_TOO_LONG",
  MalformedEmail = "MALFORMED_EMAIL",
  PasswordTooShort = "PASSWORD_TOO_SHORT",
}

export class RegisterRequest {
  public constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
  ) {}
}

export class RegisterBadRequestResponse {
  public constructor(
    public readonly errors: RegisterErrorCode[],
  ) {}
}

export const registerContract = httpContract({
  method: HttpMethod.POST,
  path: "/auth/register",
  protection: AuthProtection.None,
  credentials: Credentials.None,
  request: RegisterRequest,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.CREATED]: undefined,
    [StatusCodes.BAD_REQUEST]: RegisterBadRequestResponse,
  },
});
