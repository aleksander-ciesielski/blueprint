import type { WindowIPCEvents } from "~/types/WindowIPC";

export type WindowIPCMarkedEvents<TEvents extends WindowIPCEvents> = {
  [TEventType in keyof TEvents]: (
    id: string,
    ...args: Parameters<TEvents[TEventType]>
  ) => [id: string, result: ReturnType<TEvents[TEventType]>];
};
