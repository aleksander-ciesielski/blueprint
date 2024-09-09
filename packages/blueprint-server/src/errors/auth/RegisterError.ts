import type { HttpContracts } from "@blueprint/contracts";

export class RegisterError extends Error {
  public constructor(public readonly codes: HttpContracts.RegisterErrorCode[]) {
    super();
  }
}
