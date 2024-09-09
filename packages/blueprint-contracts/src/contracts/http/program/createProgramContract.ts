/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";
import { ProgramSnippetGroup } from "~/contracts/http";

export class CreateProgramRequest {
  public constructor(
    public readonly snippetGroups: ProgramSnippetGroup[],
    public readonly name: string,
  ) {}
}

export class CreateProgramCreatedResponse {
  public constructor(
    public readonly programId: string,
  ) {}
}

export const createProgramContract = httpContract({
  method: HttpMethod.POST,
  path: "/programs",
  protection: AuthProtection.User,
  credentials: Credentials.AccessToken,
  request: CreateProgramRequest,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.CREATED]: CreateProgramCreatedResponse,
    [StatusCodes.BAD_REQUEST]: undefined,
  },
});
