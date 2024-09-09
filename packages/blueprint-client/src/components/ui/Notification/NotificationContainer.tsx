import * as React from "react";
import * as S from "~/components/ui/Notification/NotificationContainer.styles";
import { useSelector } from "~/store/store";
import { Notification } from "~/components/ui/Notification/Notification";

export function NotificationContainer() {
  const notifications = useSelector((state) => state.notification);

  const notificationElements = notifications.list.map((notification) => (
    <Notification
      key={notification.id}
      appearance={notification.type}
      lifespanMs={notifications.lifespanMs}
    >
      {notification.content}
    </Notification>
  ));

  return (
    <S.Container>
      {notificationElements}
    </S.Container>
  );
}
