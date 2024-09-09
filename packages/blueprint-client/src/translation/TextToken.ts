import type * as React from "react";

export type TextToken<TArgs extends unknown[]> = (...args: TArgs) => React.ReactNode;
