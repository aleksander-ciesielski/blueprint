export interface RefreshTokenPayloadOptions {
  userId: string;
}

export class RefreshTokenPayload {
  public readonly userId: string;

  public constructor(options: RefreshTokenPayloadOptions) {
    this.userId = options.userId;
  }
}
