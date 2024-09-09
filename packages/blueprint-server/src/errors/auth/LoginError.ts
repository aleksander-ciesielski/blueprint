import type { HttpContracts } from "@blueprint/contracts";

export class LoginError extends Error {
  public constructor(public readonly codes: HttpContracts.LoginErrorCode[]) {
    super();
  }
}
