import * as React from "react";
import { useDispatch } from "~/store/store";
import * as S from "~/components/views/NotFoundView/NotFoundView.styles";
import { pageLoaded } from "~/store/systemSlice";
import { View } from "~/components/views/View";

export function NotFoundView() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(pageLoaded());
  }, []);

  return (
    <View allowGuests allowUsers>
      <S.Container>
        404
      </S.Container>
    </View>
  );
}
