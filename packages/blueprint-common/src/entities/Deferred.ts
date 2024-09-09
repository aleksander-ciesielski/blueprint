/* eslint-disable no-underscore-dangle */

export class Deferred<T> {
  public static of<T>(): Deferred<T> {
    return new Deferred();
  }

  private _resolve!: (value: T | PromiseLike<T>) => void;
  private _reject!: (reason?: any) => void;

  public readonly promise = new Promise<T>((resolve, reject) => {
    this._resolve = resolve;
    this._reject = reject;
  });

  public get resolve(): typeof this._resolve {
    return this._resolve;
  }

  public get reject(): typeof this._reject {
    return this._reject;
  }
}
