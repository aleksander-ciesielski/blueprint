import { instanceToPlain, plainToInstance } from "class-transformer";
import { setAccessToken } from "store/authSlice";
import { StatusCodes } from "http-status-codes";
import { HttpMethod } from "@blueprint/common";
import { match } from "ts-pattern";
import Cookies from "js-cookie";
import { HttpContracts, Credentials, HttpPayloadType } from "@blueprint/contracts";
import type { ValueOf } from "next/constants";
import type {
  HttpCodeOf, HttpContract, HttpRequestOf, HttpResponsesOf, InstanceOf,
} from "@blueprint/contracts";
import { store } from "~/store/store";
import { InvalidRefreshTokenError } from "~/errors/InvalidRefreshTokenError";
import { HttpNetworkError } from "~/errors/HttpNetworkError";
import { HttpResponse } from "~/types/http/HttpResponse";

export interface HttpRequestOptions<TContract extends HttpContract<any, any>> {
  contract: TContract;
}

export interface AbortableRequest<TContract extends HttpContract<any, any>> {
  execute(payload: InstanceOf<HttpRequestOf<TContract>>): Promise<HttpResponse<TContract>>;
  abort(): void;
}

export enum RefreshTokenStorageType {
  Persistent = "PERSISTENT",
  Session = "SESSION",
}

export class HttpService {
  private static readonly RT_COOKIE_KEY = "REFRESH_TOKEN";
  private static readonly RT_STORAGE_TYPE_KEY = "REFRESH_TOKEN_STORAGE";
  private static readonly RT_COOKIE_VALIDITY = 1000 * 60 * 60 * 24 * 365;

  private readonly API_BASE_URL: string;

  public constructor() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (API_BASE_URL === undefined) {
      throw new Error("The environment variable NEXT_PUBLIC_API_BASE_URL is not defined.");
    }

    this.API_BASE_URL = API_BASE_URL;
  }

  public request<TContract extends HttpContract<any, any>>(
    options: HttpRequestOptions<TContract>,
  ): AbortableRequest<TContract> {
    const execute = async (
      payload: InstanceOf<HttpRequestOf<TContract>>,
      abortController: AbortController,
    ): Promise<HttpResponse<TContract>> => {
      const searchParams = new URLSearchParams();

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const plain = instanceToPlain(payload) ?? {};

      if (options.contract.method === HttpMethod.GET) {
        Object.entries(plain).forEach(([key, value]) => searchParams.set(key, value));
      }

      const completeURL = new URL(
        `${options.contract.path}?${searchParams}`,
        this.API_BASE_URL,
      ).href;

      const attemptRequest = async (): Promise<Response> => {
        const token = match(options.contract.credentials)
          .with(Credentials.AccessToken, () => store.getState().auth.accessToken)
          .with(Credentials.RefreshToken, () => this.getRefreshToken())
          .otherwise(() => undefined);

        function getBody(): BodyInit | undefined {
          if (options.contract.method === HttpMethod.GET) {
            return undefined;
          }

          if (options.contract.type === HttpPayloadType.Json) {
            return JSON.stringify(plain);
          }

          const formData = new FormData();
          Object.entries(payload)
            .filter(([, value]) => !(value instanceof Blob))
            .forEach(([key, value]) => formData.append(key, value as string));

          Object.entries(payload)
            .filter(([, value]) => (value instanceof Blob))
            .forEach(([key, value]) => formData.append(key, value as Blob));

          return formData;
        }

        const body = getBody();

        const headers = {} as Record<string, string>;
        if (token !== undefined) {
          headers.authorization = `Bearer ${token}`;
        }

        if (options.contract.type === HttpPayloadType.Json) {
          headers["content-type"] = "application/json";
        }

        return fetch(completeURL, {
          method: options.contract.method,
          headers,
          body,
          signal: abortController.signal,
        });
      };

      let res = await attemptRequest();
      if (
        res.status === StatusCodes.UNAUTHORIZED.valueOf()
        && options.contract.credentials === Credentials.AccessToken
      ) {
        await this.rotateTokens();
        res = await attemptRequest();
      }

      const dataClass = options.contract.responses[res.status];
      const data = await match(dataClass)
        .with(Blob as any, () => res.blob())
        .with(undefined as any, () => undefined)
        .otherwise(async () => plainToInstance(dataClass, await res.json()));

      if (res.status > 499) {
        throw new HttpNetworkError();
      }

      return new HttpResponse(
        data as InstanceOf<ValueOf<HttpResponsesOf<TContract>>>,
        res.status as HttpCodeOf<TContract>,
      );
    };

    const abortController = new AbortController();

    return {
      execute: (payload) => execute(payload, abortController),
      abort: () => abortController.abort(),
    };
  }

  public async rotateTokens(): Promise<void> {
    const url = new URL(HttpContracts.rotateTokensContract.path, this.API_BASE_URL).href;
    const res = await fetch(url, {
      method: HttpContracts.rotateTokensContract.method,
      headers: {
        Authorization: `Bearer ${this.getRefreshToken()}`,
      },
    });

    if (res.status === StatusCodes.UNAUTHORIZED.valueOf()) {
      throw new InvalidRefreshTokenError();
    }

    const data = await res.json();

    this.setRefreshToken(data.refreshToken, this.getRefreshTokenStorageType());
    store.dispatch(setAccessToken(data.accessToken));
  }

  // eslint-disable-next-line class-methods-use-this
  public setRefreshToken(token: string, storageType: RefreshTokenStorageType): void {
    const expires = match(storageType)
      .with(RefreshTokenStorageType.Persistent, () => new Date(Date.now() + HttpService.RT_COOKIE_VALIDITY))
      .otherwise(() => undefined);

    Cookies.set(HttpService.RT_COOKIE_KEY, token, { expires });
    localStorage.setItem(HttpService.RT_STORAGE_TYPE_KEY, storageType);
  }

  // eslint-disable-next-line class-methods-use-this
  public unsetRefreshToken(): void {
    Cookies.remove(HttpService.RT_COOKIE_KEY);
  }

  // eslint-disable-next-line class-methods-use-this
  private getRefreshToken(): string | undefined {
    return Cookies.get(HttpService.RT_COOKIE_KEY);
  }

  // eslint-disable-next-line class-methods-use-this
  private getRefreshTokenStorageType(): RefreshTokenStorageType {
    const storageType = localStorage.getItem(HttpService.RT_STORAGE_TYPE_KEY) as RefreshTokenStorageType | null;
    return storageType ?? RefreshTokenStorageType.Session;
  }
}
