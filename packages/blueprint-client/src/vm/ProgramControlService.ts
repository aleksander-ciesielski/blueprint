import { store } from "~/store/store";
import {
  autoplayDisabled, autoplayEnabled,
  autoplaySpeedChanged, currentFrameChanged,
  currentFrameDecremented,
  currentFrameIncremented,
} from "~/store/programSlice";
import { ProgramAutoplaySpeed } from "~/entities/program/ProgramAutoplaySpeed";

export class ProgramControlService {
  private static readonly AUTOPLAY_STEP_TIMEOUT_MS: Record<ProgramAutoplaySpeed, number> = {
    [ProgramAutoplaySpeed.Slow]: 1_500,
    [ProgramAutoplaySpeed.Normal]: 1_000,
    [ProgramAutoplaySpeed.Fast]: 200,
  };

  private static instance: ProgramControlService | undefined;

  public static getInstance(): ProgramControlService {
    if (ProgramControlService.instance === undefined) {
      ProgramControlService.instance = new ProgramControlService();
    }

    return ProgramControlService.instance;
  }

  private autoplayTimeout: NodeJS.Timeout | undefined;

  private constructor() {}

  public setAutoplaySpeed(speed: ProgramAutoplaySpeed): void {
    store.dispatch(autoplaySpeedChanged({ speed }));
  }

  public toggleAutoplay(): void {
    if (store.getState().program.autoplayEnabled) {
      this.disableAutoplay();
    } else {
      this.enableAutoplay();
    }

    this.runAutoplayLoop(true);
  }

  public incrementFrame(): void {
    this.incrementFrameWithoutDisablingAutoplay();
    this.disableAutoplay();
  }

  public decrementFrame(): void {
    this.decrementFrameWithoutDisablingAutoplay();
    this.disableAutoplay();
  }

  public goToFirstFrame(): void {
    store.dispatch(currentFrameChanged({ frame: 0 }));
    this.disableAutoplay();
  }

  public goToLastFrame(): void {
    const frames = store.getState().program.output?.state.frames ?? [];

    store.dispatch(currentFrameChanged({ frame: frames.length - 1 }));
    this.disableAutoplay();
  }

  public disableAutoplay(): void {
    store.dispatch(autoplayDisabled());
  }

  public enableAutoplay(): void {
    store.dispatch(autoplayEnabled());
  }

  private runAutoplayLoop(setupOnly: boolean): void {
    clearTimeout(this.autoplayTimeout);

    if (!store.getState().program.autoplayEnabled) {
      return;
    }

    if (store.getState().program.currentFrameIdx + 1 === store.getState().program.output?.state.frames.length) {
      this.disableAutoplay();
      return;
    }

    const timeout = ProgramControlService.AUTOPLAY_STEP_TIMEOUT_MS[store.getState().program.autoplaySpeed];
    this.autoplayTimeout = setTimeout(() => this.runAutoplayLoop(false), timeout);

    if (setupOnly) {
      return;
    }

    this.incrementFrameWithoutDisablingAutoplay();

    if (store.getState().program.currentFrameIdx + 1 === store.getState().program.output?.state.frames.length) {
      this.disableAutoplay();
    }
  }

  private incrementFrameWithoutDisablingAutoplay(): void {
    store.dispatch(currentFrameIncremented());
  }

  private decrementFrameWithoutDisablingAutoplay(): void {
    store.dispatch(currentFrameDecremented());
  }
}
