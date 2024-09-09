import type * as React from "react";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import type { Translation } from "~/translation/Translation";
import { useSelector } from "~/store/store";
import { TranslationManager } from "~/translation/TranslationManager";

export interface UseTranslationReturnType {
  current: Translation;
  of<const TTokenArgs extends unknown[]>(
    selector: TextTokenSelector<TTokenArgs>,
    ...args: TTokenArgs
  ): React.ReactNode;
  textOf<const TTokenArgs extends unknown[]>(
    selector: TextTokenSelector<TTokenArgs>,
    ...args: TTokenArgs
  ): string;
}

export function useTranslation(): UseTranslationReturnType {
  const current = useSelector((state) => TranslationManager.getInstance().getById(state.translation.current));

  return {
    current,
    of(selector, ...args) {
      return TranslationManager.getInstance().of(selector, ...args);
    },
    textOf(selector, ...args) {
      return TranslationManager.getInstance().textOf(selector, ...args);
    },
  };
}
