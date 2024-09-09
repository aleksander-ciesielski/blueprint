import * as React from "react";
import * as S from "~/components/ui/Box/Box.styles";

export interface BoxProps {
  className?: string;
}

export const Box = React.forwardRef<HTMLDivElement, React.PropsWithChildren<BoxProps>>((props, ref) => (
  <S.Container ref={ref} className={props.className}>
    {props.children}
  </S.Container>
));
