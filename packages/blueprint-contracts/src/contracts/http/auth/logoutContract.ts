/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export const logoutContract = httpContract({
  method: HttpMethod.DELETE,
  path: "/auth",
  protection: AuthProtection.User,
  credentials: Credentials.RefreshToken,
  request: undefined,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.NO_CONTENT]: undefined,
    [StatusCodes.UNAUTHORIZED]: undefined,
  },
});
