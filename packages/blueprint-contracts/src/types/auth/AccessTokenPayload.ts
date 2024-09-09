export interface AccessTokenPayloadOptions {
  name: string | undefined;
  userId: string;
}

export class AccessTokenPayload {
  public readonly name: string | undefined;
  public readonly userId: string;

  public constructor(options: AccessTokenPayloadOptions) {
    this.name = options.name;
    this.userId = options.userId;
  }
}
