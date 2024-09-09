import * as React from "react";
import { match } from "ts-pattern";
import { useRouter } from "next/router";
import { useSelector } from "~/store/store";
import { LoaderView } from "~/components/views/LoaderView";

export interface ViewProps {
  allowUsers?: boolean;
  allowGuests?: boolean;
  redirect?: string | undefined;
}

export function View(props: React.PropsWithChildren<ViewProps>) {
  const pageReady = useSelector((state) => state.system.pageReady);
  const sessionInitialized = useSelector((state) => state.auth.sessionInitialized);
  const userId = useSelector((state) => state.auth.userId);
  const router = useRouter();
  const guestsAllowed = props.allowGuests;
  const usersAllowed = props.allowUsers;

  const isAllowed = React.useMemo(() => (
    match(userId)
      .with(undefined, () => guestsAllowed)
      .otherwise(() => usersAllowed)
  ), [userId, guestsAllowed, usersAllowed]);

  if (!sessionInitialized) {
    return <LoaderView />;
  }

  if (!isAllowed) {
    if (props.redirect !== undefined) {
      router.push(props.redirect).then();
    }

    return null;
  }

  return pageReady
    ? props.children
    : <LoaderView />;
}
