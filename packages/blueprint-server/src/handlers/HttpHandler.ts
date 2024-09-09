import type { HttpContext } from "~/models/http/HttpContext";

export type HttpHandleFunction = (
  ctx: HttpContext<any>,
  next: (ctx: HttpContext<any>) => Promise<void> | void,
) => Promise<void> | void;

export interface HttpHandler {
  handle: HttpHandleFunction;
}
