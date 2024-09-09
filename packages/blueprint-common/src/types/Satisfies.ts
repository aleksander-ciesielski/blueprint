/**
 * Similar to `satisfies` operator but on a compile-time.
 * {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator}.
 */
export type Satisfies<U, T extends U> = T;
