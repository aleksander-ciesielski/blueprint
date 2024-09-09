import type { ContextEntryType } from "~/ContextEntry";

type PrimitiveContextEntryTypeMapping = {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  undefined: undefined;
  symbol: symbol;
};

export type PrimitiveContextEntryTypeName = keyof PrimitiveContextEntryTypeMapping;

export interface PrimitiveContextEntry<TValueTypeName extends PrimitiveContextEntryTypeName> {
  type: ContextEntryType.Primitive;
  valueType: TValueTypeName;
  value: PrimitiveContextEntryTypeMapping[TValueTypeName];
}
