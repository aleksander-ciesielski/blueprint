import type { ThemeReferenceTokens } from "~/themes/tokens/reference/ThemeReferenceTokens";
import type { ThemeSystemTokens } from "~/themes/tokens/system/ThemeSystemTokens";
import type { ThemeDynamicTokens } from "~/themes/tokens/dynamic/ThemeDynamicTokens";

export interface ThemeTokens {
  reference: ThemeReferenceTokens;
  system: ThemeSystemTokens;
  dynamic: ThemeDynamicTokens;
}
