import { singleton } from "tsyringe";
import type { HttpContract } from "@blueprint/contracts";
import type { HttpContext } from "~/models/http/HttpContext";
import type { HttpGuard } from "~/guards/HttpGuard";
import { IsAuthorOf } from "~/guards/http/programs/IsAuthorOf";
import { ProgramService } from "~/services/ProgramService";
import { AllGuard } from "~/guards/logical/AllGuard";
import { SomeGuard } from "~/guards/logical/SomeGuard";

@singleton()
export class HttpGuardFactory {
  public constructor(
    private readonly programService: ProgramService,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  public all<TContract extends HttpContract<any, any>>(guards: HttpGuard<TContract>[]): HttpGuard<TContract> {
    return new AllGuard(guards);
  }

  // eslint-disable-next-line class-methods-use-this
  public some<TContract extends HttpContract<any, any>>(guards: HttpGuard<TContract>[]): HttpGuard<TContract> {
    return new SomeGuard(guards);
  }

  // eslint-disable-next-line class-methods-use-this
  public isAuthorOf<TContract extends HttpContract<any, any>>(
    getProgramId: (ctx: HttpContext<TContract>) => string,
  ): IsAuthorOf<TContract> {
    return new IsAuthorOf(getProgramId, this.programService);
  }
}
