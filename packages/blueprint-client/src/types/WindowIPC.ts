/* eslint-disable no-console */

import type { ValueOf } from "type-fest";

export type WindowIPCEvents = Record<keyof never, (...args: any[]) => any>;

export type WindowIPCEventCall<TEvents extends WindowIPCEvents> = ValueOf<{
  [TEventType in keyof TEvents]: {
    type: TEventType;
    payload: Parameters<TEvents[TEventType]>;
  };
}>;

export type WindowIPCEventResponse<TEvents extends WindowIPCEvents> = ValueOf<{
  [TEventType in keyof TEvents]: {
    type: TEventType;
    payload: Awaited<ReturnType<TEvents[TEventType]>>;
  };
}>;
