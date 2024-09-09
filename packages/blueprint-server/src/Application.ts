import type { DependencyContainer } from "tsyringe";
import { DatabaseService } from "~/services/DatabaseService";
import { GLOBAL_CONTAINER } from "~/GLOBAL_CONTAINER";
import { HttpService } from "~/services/http/HttpService";
import { EnvReader } from "~/services/EnvReader";

export class Application {
  public static async setup(): Promise<Application> {
    const app = new Application(GLOBAL_CONTAINER);

    await app.bindManualDependencies();
    await app.setupDependencies();

    return app;
  }

  private constructor(
    public readonly container: DependencyContainer,
  ) {}

  private async bindManualDependencies(): Promise<void> {
    this.container.register(DatabaseService, {
      useValue: await DatabaseService.create(new EnvReader()),
    });

    this.container.register(HttpService, {
      useValue: HttpService.create(this.container),
    });
  }

  private async setupDependencies(): Promise<void> {
    await this.container.resolve(HttpService).start();
  }
}
