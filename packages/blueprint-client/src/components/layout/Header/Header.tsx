import { MdLanguage } from "react-icons/md";
import * as React from "react";
import { match } from "ts-pattern";
import * as S from "~/components/layout/Header/Header.styles";
import { ThemeToggleButton } from "~/components/app/ThemeToggleButton/ThemeToggleButton";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { Button } from "~/components/ui/Button/Button";
import { useTranslation } from "~/hooks/translation/useTranslation";
import { useDispatch } from "~/store/store";
import { enUK } from "~/translation/translations/en-UK";
import { plPL } from "~/translation/translations/pl-PL";
import { languageChanged } from "~/store/translationSlice";

export function Header() {
  const translation = useTranslation();
  const dispatch = useDispatch();

  const toggleLanguage = React.useCallback(() => {
    const newLanguage = match(translation.current.id)
      .with(enUK.id, () => plPL)
      .with(plPL.id, () => enUK)
      .otherwise(() => {
        throw new Error();
      });

    dispatch(languageChanged(newLanguage));
  }, [translation.current]);

  return (
    <S.Container rounded={false}>
      <S.CenterLogoLink href="/">
        <S.CenterLogo />
      </S.CenterLogoLink>
      <S.RightMenu>
        <ThemeToggleButton
          rounded="left"
          size={SystemTokenSize.Medium}
        />
        <Button
          rounded="right"
          size={SystemTokenSize.Medium}
          onPress={toggleLanguage}
          icon={MdLanguage}
        >
          {translation.of(translation.current.name)}
        </Button>
      </S.RightMenu>
    </S.Container>
  );
}
