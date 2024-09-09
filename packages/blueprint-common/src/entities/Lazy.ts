export class Lazy<T> {
  private static readonly UNINITIALIZED = Symbol("UNINITIALIZED");

  public static of<T>(factory: () => Promise<T> | T): Lazy<T> {
    return new Lazy(factory);
  }

  private value: T | typeof Lazy.UNINITIALIZED = Lazy.UNINITIALIZED;

  public constructor(
    private readonly factory: () => Promise<T> | T,
  ) {}

  public async get(): Promise<T> {
    if (this.value === Lazy.UNINITIALIZED) {
      this.value = await this.factory();
    }

    return this.value;
  }
}
