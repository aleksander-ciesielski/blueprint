import { HttpMethod } from "@blueprint/common";
import { StatusCodes } from "http-status-codes";
import type { ProgramEntry } from "~/contracts/http/program/entities/ProgramEntry";
import { AuthProtection } from "~/AuthProtection";
import { Credentials } from "~/types/auth/Credentials";
import { httpContract } from "~/contracts/http/HttpContract";
import { HttpPayloadType } from "~/contracts/http/HttpPayloadType";

export class GetAllProgramsOkResponse {
  public constructor(
    public readonly programs: ProgramEntry[],
  ) {}
}

export const getAllProgramsContract = httpContract({
  method: HttpMethod.GET,
  path: "/programs/all",
  protection: AuthProtection.None,
  credentials: Credentials.None,
  type: HttpPayloadType.Json,
  request: undefined,
  responses: {
    [StatusCodes.OK]: GetAllProgramsOkResponse,
  },
});
