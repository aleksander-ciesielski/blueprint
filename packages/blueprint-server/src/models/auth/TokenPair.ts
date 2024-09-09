import type { RefreshToken } from "~/models/auth/RefreshToken";
import type { AccessToken } from "~/models/auth/AccessToken";

export interface TokenPairOptions {
  refresh: RefreshToken;
  access: AccessToken;
}

export class TokenPair {
  public readonly refresh: RefreshToken;
  public readonly access: AccessToken;

  public constructor(options: TokenPairOptions) {
    this.refresh = options.refresh;
    this.access = options.access;
  }
}
