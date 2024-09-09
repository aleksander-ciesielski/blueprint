import { HttpMethod } from "@blueprint/common";
import { StatusCodes } from "http-status-codes";
import type { Program } from "~/contracts/http/program/entities/Program";
import type { ProgramReaction } from "~/contracts/http/program/entities/ProgramReaction";
import { AuthProtection } from "~/AuthProtection";
import { Credentials } from "~/types/auth/Credentials";
import { httpContract } from "~/contracts/http/HttpContract";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export class GetProgramRequest {
  public constructor(
    public readonly programId: string,
  ) {}
}

export class GetProgramOkResponse {
  public constructor(
    public readonly program: Program,
    public readonly positiveReactions: number,
    public readonly negativeReactions: number,
    public readonly userReaction: ProgramReaction,
  ) {}
}

export const getProgramContract = httpContract({
  method: HttpMethod.GET,
  path: "/programs",
  protection: AuthProtection.None,
  credentials: Credentials.AccessToken,
  request: GetProgramRequest,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.OK]: GetProgramOkResponse,
    [StatusCodes.NOT_FOUND]: undefined,
  },
});
