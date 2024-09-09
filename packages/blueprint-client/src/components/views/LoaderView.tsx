import * as React from "react";
import * as S from "~/components/views/View.styles";
import { Spinner } from "~/components/icons/Spinner";

export function LoaderView() {
  return (
    <S.Loader>
      <S.LoaderIcon>
        <Spinner />
      </S.LoaderIcon>
    </S.Loader>
  );
}
