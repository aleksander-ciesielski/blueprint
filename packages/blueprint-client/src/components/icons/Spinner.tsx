import * as React from "react";
import * as S from "~/components/icons/Spinner.styles";
import { useAnimation } from "~/hooks/useAnimation";

const ROTATION_SPEED = 0.005;

export interface SpinnerProps {
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  const [radians, setRadians] = React.useState(0);

  useAnimation((delta) => {
    setRadians((current) => (current + delta * ROTATION_SPEED) % (2 * Math.PI));
  });

  return (
    <S.Spinner
      className={props.className}
      aria-hidden={true}
      style={{ transform: `rotate(${radians}rad)` }}
    />
  );
}
