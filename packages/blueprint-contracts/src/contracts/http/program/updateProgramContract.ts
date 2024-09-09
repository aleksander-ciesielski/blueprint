/* eslint-disable @typescript-eslint/indent */

import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { AuthProtection } from "~/AuthProtection";
import { httpContract } from "~/contracts/http/HttpContract";
import { Credentials } from "~/types/auth/Credentials";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";
import { ProgramSnippetGroup } from "~/contracts/http";

export class UpdateProgramRequest {
  public constructor(
    public readonly programId: string,
    public readonly name: string,
    public readonly snippetGroups: ProgramSnippetGroup[],
  ) {}
}

export const updateProgramContract = httpContract({
  method: HttpMethod.PUT,
  path: "/programs",
  protection: AuthProtection.User,
  credentials: Credentials.AccessToken,
  request: UpdateProgramRequest,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.OK]: undefined,
    [StatusCodes.BAD_REQUEST]: undefined,
  },
});
