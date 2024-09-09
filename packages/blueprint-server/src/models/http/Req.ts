import { HttpContracts } from "@blueprint/contracts";
import { plainToInstance } from "class-transformer";
import { HttpMethod } from "@blueprint/common";
import type {
  HttpContract, HttpRequestOf, InstanceOf,
} from "@blueprint/contracts";
import type { Request } from "express";
import type { Constructor } from "type-fest";

export class Req<const TContract extends HttpContract<any, any>> {
  public static isFileRequest<TRequest extends Constructor<any> | undefined>(
    request: TRequest,
  ): request is TRequest & HttpContracts.HttpFileContractRequest {
    if (request === undefined) {
      return false;
    }

    return (request as any)[HttpContracts.HTTP_FILE_CONTRACT] === true;
  }

  public readonly payload: InstanceOf<HttpRequestOf<TContract>>;

  public constructor(
    public readonly contract: TContract,
    private readonly $request: Request,
  ) {
    this.payload = this.transformPlainRequest();
  }

  public getFile(): Buffer {
    if (Req.isFileRequest(this.contract.request)) {
      return this.$request.file!.buffer;
    }

    throw new Error("No file upload is specified for this contract.");
  }

  private transformPlainRequest(): InstanceOf<HttpRequestOf<TContract>> {
    if (this.contract.request === undefined) {
      return undefined as InstanceOf<HttpRequestOf<TContract>>;
    }

    const plain = (this.$request.method === HttpMethod.GET.toString())
      ? this.$request.query
      : this.$request.body;

    return plainToInstance(this.contract.request, plain) as InstanceOf<HttpRequestOf<TContract>>;
  }
}
