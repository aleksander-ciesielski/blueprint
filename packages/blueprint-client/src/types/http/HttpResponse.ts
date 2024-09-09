import type {
  HttpCodeOf, HttpContract, HttpResponsesOf, InstanceOf,
} from "@blueprint/contracts";
import type { ValueOf } from "next/constants";
import { HttpResponseCastError } from "~/errors/HttpResponseCastError";

export type HttpResponseMappers<TContract extends HttpContract<any, any>, TMappedValue> = {
  [K in HttpCodeOf<TContract>]: (response: InstanceOf<HttpResponsesOf<TContract>[K]>) => TMappedValue;
};

export class HttpResponse<TContract extends HttpContract<any, any>> {
  public constructor(
    public readonly data: InstanceOf<ValueOf<HttpResponsesOf<TContract>>>,
    public readonly code: HttpCodeOf<TContract>,
  ) {}

  public castOrThrow<TCode extends HttpCodeOf<TContract>>(
    code: TCode,
  ): InstanceOf<HttpResponsesOf<TContract>[TCode]> {
    if (this.code === code) {
      return this.data;
    }

    throw new HttpResponseCastError();
  }

  public map<TMappedValue>(mappers: HttpResponseMappers<TContract, TMappedValue>): TMappedValue {
    return mappers[this.code](this.data);
  }
}
