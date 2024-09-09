import type { ThemeTokens } from "~/themes/tokens/ThemeTokens";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import type { SystemSizeBasedTokens } from "~/themes/tokens/system/size/SystemSizeBasedTokens";
import type { editor } from "monaco-editor";

export interface Theme {
  id: string;
  name: TextTokenSelector<[]>;
  tokens: ThemeTokens;
  editor: editor.IStandaloneThemeData;
  resolveSizeBasedToken(size: SystemTokenSize | undefined, tokens: SystemSizeBasedTokens): string;
}
