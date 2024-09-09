import { match } from "ts-pattern";
import type { editor } from "monaco-editor";
import type { OmitDeep } from "type-fest";
import type { Theme } from "~/themes/Theme";
import type { ThemeReferenceTokens } from "~/themes/tokens/reference/ThemeReferenceTokens";
import type { ThemeDynamicTokens } from "~/themes/tokens/dynamic/ThemeDynamicTokens";
import type { ThemeSystemTokensFactory } from "~/themes/tokens/system/ThemeSystemTokensFactory";
import type { SystemSizeBasedTokens } from "~/themes/tokens/system/size/SystemSizeBasedTokens";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import type { ThemeTokens } from "~/themes/tokens/ThemeTokens";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { defaultSystemTokensFactory } from "~/themes/defaultSystemTokensFactory";

type ThemeTokensWithoutDynamicTokens = OmitDeep<ThemeTokens, "dynamic">;

export interface CreateThemePayload {
  id: string;
  name: TextTokenSelector<[]>;
  editor(tokens: ThemeTokens): editor.IStandaloneThemeData;
  tokens: {
    reference: ThemeReferenceTokens;
    system: ThemeSystemTokensFactory;
    dynamic(tokens: ThemeTokensWithoutDynamicTokens): ThemeDynamicTokens;
  };
}

export function createTheme(payload: CreateThemePayload): Theme {
  const systemTokens = defaultSystemTokensFactory(payload.tokens.reference);
  const referenceTokens = payload.tokens.reference;
  const dynamicTokens = payload.tokens.dynamic({
    system: systemTokens,
    reference: referenceTokens,
  });

  const editorTheme = payload.editor({
    system: systemTokens,
    reference: referenceTokens,
    dynamic: dynamicTokens,
  });

  return {
    id: payload.id,
    name: payload.name,
    editor: editorTheme,
    tokens: {
      reference: payload.tokens.reference,
      system: systemTokens,
      dynamic: dynamicTokens,
    },
    resolveSizeBasedToken(size: SystemTokenSize | undefined, tokens: SystemSizeBasedTokens): string {
      return match(size)
        .with(SystemTokenSize.ExtraSmall, () => tokens.xsmall)
        .with(SystemTokenSize.Small, () => tokens.small)
        .with(SystemTokenSize.Medium, () => tokens.medium)
        .with(SystemTokenSize.Large, () => tokens.large)
        .with(SystemTokenSize.ExtraLarge, () => tokens.xlarge)
        .with(SystemTokenSize.DoubleExtraLarge, () => tokens.xxlarge)
        .otherwise(() => tokens.medium);
    },
  };
}
