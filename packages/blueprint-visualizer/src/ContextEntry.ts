import type { PrimitiveContextEntry, PrimitiveContextEntryTypeName } from "~/context/PrimitiveContextEntry";

export enum ContextEntryType {
  Primitive = "PRIMITIVE",
}

export type ContextEntry =
  | PrimitiveContextEntry<PrimitiveContextEntryTypeName>;
