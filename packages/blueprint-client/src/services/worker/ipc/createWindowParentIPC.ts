/* eslint-disable max-len */

import { nanoid } from "nanoid/non-secure";
import { Deferred } from "@blueprint/common";
import type { WindowIPCEventResponse, WindowIPCEvents } from "~/types/WindowIPC";
import type { WindowIPCMarkedEvents } from "~/services/worker/ipc/WindowIPCMarkedEvents";

export type WorkerParentIPC<TEvents extends WindowIPCEvents> = {
  [TEventType in keyof TEvents]: (...args: Parameters<TEvents[TEventType]>) => Promise<Awaited<ReturnType<TEvents[TEventType]>>>;
};

export function createWindowParentIPC<TEvents extends WindowIPCEvents>(
  postMessageToTarget: (message: unknown) => void,
  filterResponse: (event: MessageEvent) => boolean,
  registerHostMessageListener: (listener: (event: MessageEvent<WindowIPCEventResponse<WindowIPCMarkedEvents<TEvents>>>) => void) => void,
  unregisterHostMessageListener: (listener: (event: MessageEvent<WindowIPCEventResponse<WindowIPCMarkedEvents<TEvents>>>) => void) => void,
): WorkerParentIPC<TEvents> {
  return new Proxy({} as WorkerParentIPC<TEvents>, {
    get(_, type) {
      return async <TEventType extends keyof TEvents>(
        ...payload: Parameters<TEvents[TEventType]>
      ): Promise<Awaited<ReturnType<TEvents[TEventType]>>> => {
        const result = Deferred.of<Awaited<ReturnType<TEvents[TEventType]>>>();
        const callId = nanoid();

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (event: MessageEvent<WindowIPCEventResponse<WindowIPCMarkedEvents<TEvents>>>) => {
          if (!filterResponse(event)) {
            return;
          }

          const [responseId, responsePayload] = event.data.payload;
          if (responseId !== callId) {
            return;
          }

          result.resolve(responsePayload);
          unregisterHostMessageListener(listener);
        };

        registerHostMessageListener(listener);

        postMessageToTarget({
          type,
          payload: [callId, ...payload] as Parameters<WindowIPCMarkedEvents<TEvents>[keyof TEvents]>,
        });

        return result.promise;
      };
    },
  });
}
