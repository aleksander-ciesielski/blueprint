import * as React from "react";
import * as S from "~/components/ui/Panel/Panel.styles";

export interface PanelProps {
  className?: string;
  rounded?: boolean;
}

export function Panel(props: React.PropsWithChildren<PanelProps>) {
  const rounded = props.rounded ?? true;

  return (
    <S.Container className={props.className} $rounded={rounded}>
      {props.children}
    </S.Container>
  );
}
