export class NullStorage implements Storage {
  public readonly length = 0;

  public getItem(): string | null {
    return null;
  }

  public key(): string | null {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public clear(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public removeItem(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setItem(): void {}
}
