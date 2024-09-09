/* eslint-disable max-len */

import type { WindowIPCEvents } from "~/types/WindowIPC";
import type { WindowIPCMarkedEvents } from "~/services/worker/ipc/WindowIPCMarkedEvents";

export type WorkerChildIPC<TEvents extends WindowIPCEvents> = {
  [TEventType in keyof TEvents]: (...args: Parameters<TEvents[TEventType]>) => ReturnType<TEvents[TEventType]> | Promise<Awaited<ReturnType<TEvents[TEventType]>>>;
};

export function mountWindowChildIPC<const TEvents extends WindowIPCEvents>(
  registerMessageListener: (listener: (event: MessageEvent) => void) => void,
  sendMessage: (message: unknown) => void,
  ipc: WorkerChildIPC<TEvents>,
): void {
  registerMessageListener(async (event) => {
    const [id, ...args] = event.data.payload;
    const type = event.data.type;

    const result = await ipc[type]!(...args);

    sendMessage({
      type,
      payload: [id, result] as Awaited<ReturnType<WindowIPCMarkedEvents<TEvents>[keyof TEvents]>>,
    });
  });
}
