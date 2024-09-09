import * as React from "react";
import { ThemeProvider } from "styled-components";
import { useMonaco } from "@monaco-editor/react";
import { useDispatch, useSelector } from "~/store/store";
import { themeChanged } from "~/store/themeSlice";
import { ThemeManager } from "~/themes/ThemeManager";
import { languageChanged } from "~/store/translationSlice";
import { TranslationManager } from "~/translation/TranslationManager";
import { useTheme } from "~/hooks/theme/useTheme";
import { refreshSession } from "~/store/authSlice";

export interface ProviderInitializerProps {
  loader: React.ReactNode;
}

export function ProviderInitializer(props: React.PropsWithChildren<ProviderInitializerProps>) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const monaco = useMonaco();
  const ready = useSelector((state) => state.auth.sessionInitialized);

  React.useEffect(() => {
    dispatch(themeChanged(ThemeManager.getInstance().read()));
    dispatch(languageChanged(TranslationManager.getInstance().read()));
    dispatch(refreshSession());
  }, []);

  React.useEffect(() => {
    if (monaco === null) {
      return;
    }

    ThemeManager.getInstance().register(monaco);
  }, [monaco]);

  return (
    <ThemeProvider theme={theme}>
      {
        ready
          ? props.children
          : props.loader
      }
    </ThemeProvider>
  );
}
