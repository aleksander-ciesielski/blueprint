import type { ThemeReferenceTokens } from "~/themes/tokens/reference/ThemeReferenceTokens";
import type { ThemeSystemTokens } from "~/themes/tokens/system/ThemeSystemTokens";

export type ThemeSystemTokensFactory = (reference: ThemeReferenceTokens) => ThemeSystemTokens;
