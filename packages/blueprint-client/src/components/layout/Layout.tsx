import type * as React from "react";
import * as S from "~/components/layout/Layout.styles";
import { Header } from "~/components/layout/Header/Header";
import { NotificationContainer } from "~/components/ui/Notification/NotificationContainer";
import { UserInfo } from "~/components/layout/UserInfo/UserInfo";

export function Layout(props: React.PropsWithChildren) {
  return (
    <S.Container>
      <Header />
      <S.Main>
        <S.UserInfoContainer>
          <UserInfo />
        </S.UserInfoContainer>
        <S.Content>
          {props.children}
          <NotificationContainer />
        </S.Content>
      </S.Main>
    </S.Container>
  );
}
