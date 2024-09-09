import type { ThemeTokens } from "~/themes/tokens/ThemeTokens";

export type ThemeTokenSelector<T = string> = (tokens: ThemeTokens) => T;
