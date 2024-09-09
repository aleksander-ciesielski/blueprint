import * as React from "react";
import { View } from "~/components/views/View";
import * as S from "~/components/views/RegisterView/RegisterView.styles";
import Register from "~/components/app/Register/Register";
import { pageLoaded } from "~/store/systemSlice";
import { useDispatch } from "~/store/store";

export function RegisterView() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(pageLoaded());
  }, []);

  return (
    <View allowGuests redirect="/">
      <S.Container>
        <S.RegisterPanel>
          <Register />
        </S.RegisterPanel>
      </S.Container>
    </View>
  );
}
