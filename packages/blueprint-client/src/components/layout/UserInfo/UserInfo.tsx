import * as React from "react";
import { useDispatch, useSelector } from "~/store/store";
import { useTranslation } from "~/hooks/translation/useTranslation";
import { logout } from "~/store/authSlice";
import * as S from "~/components/layout/UserInfo/UserInfo.styles";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";

export function UserInfo() {
  const translation = useTranslation();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.name);
  const isLoggedIn = useSelector((state) => (state.auth.userId !== undefined));

  const handleLogoutClick = React.useCallback(() => {
    dispatch(logout());
  }, [isLoggedIn]);

  const text = (isLoggedIn)
    ? translation.of((tokens) => tokens.auth.welcomeUser, userName)
    : translation.of((tokens) => tokens.auth.welcomeGuest);

  const action = (isLoggedIn)
    ? (
      <S.ActionButton onPress={handleLogoutClick} size={SystemTokenSize.ExtraSmall}>
        {translation.of((tokens) => tokens.auth.logoutAction)}
      </S.ActionButton>
    )
    : (
      <S.ActionButton href="/login" size={SystemTokenSize.ExtraSmall}>
        {translation.of((tokens) => tokens.auth.loginAction)}
      </S.ActionButton>
    );

  return (
    <S.Container>
      <S.Text>
        {text}
      </S.Text>
      {action}
    </S.Container>
  );
}
