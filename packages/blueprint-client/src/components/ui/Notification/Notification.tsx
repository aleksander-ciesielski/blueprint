import * as React from "react";
import { match } from "ts-pattern";
import { GoCheckCircleFill } from "react-icons/go";
import { MdError } from "react-icons/md";
import * as S from "~/components/ui/Notification/Notification.styles";

export interface NotificationProps {
  appearance: "success" | "danger";
  lifespanMs: number;
  children?: React.ReactNode;
}

export function Notification(props: NotificationProps) {
  const icon = match(props.appearance)
    .with("success", () => <GoCheckCircleFill />)
    .with("danger", () => <MdError />)
    .exhaustive();

  return (
    <S.Container data-appearance={props.appearance} $lifespanMs={props.lifespanMs}>
      <S.NotificationIcon aria-hidden={true}>
        {icon}
      </S.NotificationIcon>
      <S.Content>
        {props.children}
      </S.Content>
    </S.Container>
  );
}
