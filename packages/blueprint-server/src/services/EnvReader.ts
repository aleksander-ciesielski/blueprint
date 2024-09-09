import { singleton } from "tsyringe";

export type EnvTransformer<T> = (raw: string, name: string) => T;

@singleton()
export class EnvReader {
  public static readonly string: EnvTransformer<string> = (raw) => raw;

  public static readonly boolean: EnvTransformer<boolean> = (raw, name) => {
    if (raw !== "true" && raw !== "false") {
      throw new Error(`Unexpected non-boolean value for the "${name}" environment variable.`);
    }

    return (raw === "true");
  };

  public static readonly integer: EnvTransformer<number> = (raw, name) => {
    const parsedValue = parseInt(raw, 10);
    if (!Number.isInteger(parsedValue)) {
      throw new Error(`Unexpected non-integer value for the "${name}" environment variable.`);
    }

    return parsedValue;
  };

  public getOrThrow<T>(
    name: string,
    transformer: EnvTransformer<T>,
  ): T {
    const value = this.get(name, transformer);
    if (value === undefined) {
      throw new Error(`Unresolved environment variable "${name}".`);
    }

    return value;
  }

  public get<T>(
    name: string,
    transformer: EnvTransformer<T>,
  ): T | undefined {
    const value = process.env[name];
    if (value === undefined) {
      return undefined;
    }

    return transformer(value, name);
  }
}
