/* eslint-disable max-len */

import { VisualizerReevaluateErrorReason } from "@blueprint/visualizer";
import { match } from "ts-pattern";
import type { VisualizerValidator } from "@blueprint/visualizer";
import type { Lazy } from "@blueprint/common";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { Runner } from "~/types/vm/Runner";
import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import { store } from "~/store/store";
import { pushNotification } from "~/store/notificationSlice";
import { TranslationManager } from "~/translation/TranslationManager";

export class SnippetService {
  private static getVisualizerReevaluateErrorReasonTranslationTokenSelector(
    reason: VisualizerReevaluateErrorReason,
  ): TextTokenSelector<[]> {
    return match<VisualizerReevaluateErrorReason, TextTokenSelector<[]>>(reason)
      .with(VisualizerReevaluateErrorReason.TooManyVisualizerEntities, () => (tokens) => tokens.program.error.tooManyVisualizerEntities)
      .with(VisualizerReevaluateErrorReason.TrackedEntityValueChangedInHiddenSnippet, () => (tokens) => tokens.program.error.trackedEntityValueChangedInHiddenSnippet)
      .with(VisualizerReevaluateErrorReason.TrackedEntityVisibilityChangedInVisibleSnippet, () => (tokens) => tokens.program.error.trackedEntityVisibilityChangedInVisibleSnippet)
      .with(VisualizerReevaluateErrorReason.EntityTrackingEnabledInVisibleSnippet, () => (tokens) => tokens.program.error.entityTrackingEnabledInVisibleSnippet)
      .exhaustive();
  }

  public constructor(
    private readonly visualizerValidator: VisualizerValidator,
    private readonly runner: Lazy<Runner>,
  ) {}

  public async init(): Promise<void> {
    await this.runner.get();
  }

  public async build(snippetGroups: SnippetGroup[]): Promise<RunnerBuildOutput | undefined> {
    const runnerBuildOutput = await this.runner.get().then((runner) => runner.build(snippetGroups));

    if (!runnerBuildOutput.success) {
      const content = TranslationManager.getInstance().textOf(
        (Object.values(VisualizerReevaluateErrorReason).includes(runnerBuildOutput.reason as VisualizerReevaluateErrorReason))
          ? SnippetService.getVisualizerReevaluateErrorReasonTranslationTokenSelector(runnerBuildOutput.reason as VisualizerReevaluateErrorReason)
          : (tokens) => () => tokens.program.error.unhandled(runnerBuildOutput.reason),
      );

      store.dispatch(pushNotification({
        type: "danger",
        content,
      }));

      return undefined;
    }

    this.visualizerValidator.validateState(runnerBuildOutput.state);

    return runnerBuildOutput;
  }
}
