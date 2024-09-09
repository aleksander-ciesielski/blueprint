import * as React from "react";
import { match } from "ts-pattern";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { createGlobalStyle } from "styled-components";
import type { ButtonProps } from "~/components/ui/Button/Button";
import { Button } from "~/components/ui/Button/Button";
import { useDispatch } from "~/store/store";
import { useTheme } from "~/hooks/theme/useTheme";
import { lightTheme } from "~/themes/themes/lightTheme";
import { darkTheme } from "~/themes/themes/darkTheme";
import { themeChanged } from "~/store/themeSlice";

export interface ThemeToggleButtonProps extends ButtonProps {

}

const DisabledTransitionStyles = createGlobalStyle`
  * {
    transition-duration: 0ms !important;
  }
`;

export function ThemeToggleButton(props: ThemeToggleButtonProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [disabledTransitions, setDisabledTransitions] = React.useState(false);

  const toggleTheme = React.useCallback(() => {
    const newTheme = match(theme.id)
      .with(lightTheme.id, () => darkTheme)
      .with(darkTheme.id, () => lightTheme)
      .otherwise(() => {
        throw new Error();
      });

    setDisabledTransitions(true);
    dispatch(themeChanged(newTheme));
  }, [theme]);

  React.useEffect(() => {
    if (!disabledTransitions) {
      return;
    }

    setDisabledTransitions(false);
  }, [disabledTransitions]);

  return (
    <>
      {disabledTransitions && <DisabledTransitionStyles />}
      <Button
        {...props}
        onPress={toggleTheme}
        icon={theme === lightTheme ? MdLightMode : MdDarkMode}
      />
    </>
  );
}
