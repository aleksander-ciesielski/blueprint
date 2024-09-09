import type { Class } from "type-fest";

export type InstanceOf<TValue> = (
  TValue extends Class<infer TInstance>
    ? TInstance
    : TValue
);
