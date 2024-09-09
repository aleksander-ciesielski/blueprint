import * as React from "react";
import type { EventBus } from "~/entities/EventBus";

export function useEventBus<TPayload>(
  bus: EventBus<TPayload>,
  listener: (payload: TPayload) => void,
  deps: unknown[],
) {
  const callback = React.useCallback(listener, deps);

  React.useEffect(() => {
    bus.subscribe(callback);
    return () => bus.unsubscribe(callback);
  }, [callback]);
}
