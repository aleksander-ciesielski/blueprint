import * as React from "react";
import { View } from "~/components/views/View";
import * as S from "~/components/views/LoginView/LoginView.styles";
import Login from "~/components/app/Login/Login";
import { pageLoaded } from "~/store/systemSlice";
import { useDispatch } from "~/store/store";

export function LoginView() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(pageLoaded());
  }, []);

  return (
    <View allowGuests redirect="/">
      <S.Container>
        <S.LoginPanel>
          <Login />
        </S.LoginPanel>
      </S.Container>
    </View>
  );
}
