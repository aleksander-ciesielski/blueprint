import { HttpMethod } from "@blueprint/common";
import { StatusCodes } from "http-status-codes";
import type { ProgramReaction } from "~/contracts/http/program/entities/ProgramReaction";
import { AuthProtection } from "~/AuthProtection";
import { Credentials } from "~/types/auth/Credentials";
import { httpContract } from "~/contracts/http/HttpContract";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export class ReactOnProgramRequest {
  public constructor(
    public readonly programId: string,
    public readonly reaction: ProgramReaction,
  ) {}
}

export class ReactOnProgramOkResponse {
  public constructor(
    public readonly positiveReactions: number,
    public readonly negativeReactions: number,
    public readonly userReaction: ProgramReaction,
  ) {}
}

export const reactOnProgramContract = httpContract({
  method: HttpMethod.POST,
  path: "/program/reactions",
  protection: AuthProtection.User,
  credentials: Credentials.AccessToken,
  request: ReactOnProgramRequest,
  type: HttpPayloadType.Json,
  responses: {
    [StatusCodes.OK]: ReactOnProgramOkResponse,
    [StatusCodes.NOT_FOUND]: undefined,
  },
});
