import React from "react";
import * as S from "~/components/app/Logo/Logo.styles";

export interface LogoProps {
  className?: string;
}

export function Logo(props: LogoProps) {
  return (
    <S.Logo className={props.className}>
      <S.LogoPrimary>Blue</S.LogoPrimary>
      <S.LogoAccent>Print</S.LogoAccent>
    </S.Logo>
  );
}
