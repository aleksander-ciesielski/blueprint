import express from "express";
import { HttpMethod } from "@blueprint/common";
import { singleton } from "tsyringe";
import { match } from "ts-pattern";
import cors from "cors";
import multer from "multer";
import type { HttpContract, HttpContracts } from "@blueprint/contracts";
import type { Class } from "type-fest";
import type { DependencyContainer } from "tsyringe";
import type { Application, RequestHandler } from "express";
import type { HttpContextOptions } from "~/models/http/HttpContext";
import { HttpHandleFunction, HttpHandler } from "~/handlers/HttpHandler";
import { InternalServerErrorHttpHandler } from "~/handlers/http/InternalServerErrorHttpHandler";
import { HttpContext } from "~/models/http/HttpContext";
import { EnvReader } from "~/services/EnvReader";
import { HttpErrorHandler } from "~/handlers/http/HttpErrorHandler";
import { AuthProtectionHandler } from "~/handlers/auth/AuthProtectionHandler";
import { AccessTokenService } from "~/services/auth/AccessTokenService";
import { RefreshTokenService } from "~/services/auth/RefreshTokenService";
import { Req } from "~/models/http/Req";

@singleton()
export class HttpService {
  private static readonly HANDLERS = [
    AuthProtectionHandler,
    HttpErrorHandler,
    InternalServerErrorHttpHandler,
  ] as const satisfies readonly Class<HttpHandler>[];

  private readonly HTTP_PORT: number;
  private readonly HTTP_BODY_SIZE_LIMIT: string;

  private readonly multer = multer({
    storage: multer.memoryStorage(),
  });

  public static create(container: DependencyContainer): HttpService {
    return new HttpService(
      HttpService.HANDLERS.map((token) => container.resolve(token)),
      new EnvReader(),
      container.resolve(RefreshTokenService),
      container.resolve(AccessTokenService),
    );
  }

  private readonly app = express();
  private readonly handle: HttpHandleFunction;

  public constructor(
    private readonly handlers: HttpHandler[],
    private readonly envReader: EnvReader,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
  ) {
    this.HTTP_PORT = this.envReader.getOrThrow("PORT", EnvReader.integer);
    this.HTTP_BODY_SIZE_LIMIT = this.envReader.getOrThrow("HTTP_BODY_SIZE_LIMIT", EnvReader.string);

    this.handle = this.handlers
      .map((handler) => handler.handle.bind(handler))
      .reduce(
        (composed, current) => (ctx, next) => current(ctx, () => composed(ctx, next)),
        (ctx, next) => next(ctx),
      );
  }

  public getRawApplication(): Application {
    return this.app;
  }

  public registerContract<TContract extends HttpContract<any, any>>(
    contract: TContract,
    handler: (ctx: HttpContext<TContract>) => Promise<void> | void,
  ): void {
    const expressMethod = match(contract.method)
      .with(HttpMethod.GET, () => "get" as const)
      .with(HttpMethod.POST, () => "post" as const)
      .with(HttpMethod.PATCH, () => "patch" as const)
      .with(HttpMethod.DELETE, () => "delete" as const)
      .with(HttpMethod.PUT, () => "put" as const)
      .exhaustive();

    const fileRequestHandler: RequestHandler = Req.isFileRequest(contract.request)
      ? this.multer.single("$file" satisfies keyof HttpContracts.HttpFileContractRequest)
      : this.multer.none();

    this.getRawApplication()[expressMethod](contract.path, fileRequestHandler, async ($req, $res) => {
      const opts: HttpContextOptions<TContract> = {
        contract,
        $req,
        $res,
      };

      const ctx = new HttpContext(
        opts,
        this.refreshTokenService,
        this.accessTokenService,
      );

      await this.handle(ctx, () => handler(ctx) as Promise<void>);
    });
  }

  public async start(): Promise<void> {
    this.app.use(express.json({
      limit: this.HTTP_BODY_SIZE_LIMIT,
    }));

    this.app.use(express.urlencoded({
      limit: this.HTTP_BODY_SIZE_LIMIT,
    }));

    this.app.use(cors({
      origin: this.envReader.getOrThrow("CLIENT_URL", EnvReader.string),
      credentials: true,
    }));

    await import("~/controllers");

    this.app.listen(this.HTTP_PORT);
  }
}
