/* eslint-disable no-restricted-globals */

import { Visualizer, VisualizerReevaluateError } from "@blueprint/visualizer";
import { nanoid } from "nanoid/non-secure";
import type { IsolatedWorkerRunnerEvents } from "~/vm/runners/isolatedWorkerRunner/IsolatedWorkerRunnerEvents";
import type { WorkerChildIPC } from "~/services/worker/ipc/mountWindowChildIPC";
import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { RunnerBuildFailure } from "~/types/vm/RunnerBuildFailure";
import { mountWindowChildIPC } from "~/services/worker/ipc/mountWindowChildIPC";
import { AlgorithmCodeTransformer } from "~/services/vm/AlgorithmCodeTransformer";

class WorkerRunnerChildIPC implements WorkerChildIPC<IsolatedWorkerRunnerEvents> {
  private algorithmCodeTransformer: AlgorithmCodeTransformer | undefined;

  public async setup(libs: Map<string, string>): Promise<void> {
    this.algorithmCodeTransformer = new AlgorithmCodeTransformer(libs);
  }

  public async build(snippetGroups: SnippetGroup[]): Promise<RunnerBuildOutput | RunnerBuildFailure> {
    if (this.algorithmCodeTransformer === undefined) {
      return {
        success: false,
        reason: "AlgorithmCodeTransformer is undefined",
      };
    }

    try {
      const visualizer = new Visualizer(() => nanoid());
      const ctx = this.algorithmCodeTransformer.transformToBuildContext(snippetGroups);
      const unsafeExecutableJs = this.algorithmCodeTransformer.transformToExecutableJs(
        ctx.unsafeJsAstWithVisualizerUpdates,
        "visualizer",
      );

      // eslint-disable-next-line no-eval -- Running unsafe code is safe here as it is in a worker spawned by a sandboxed iframe operating on a different domain.
      await eval(unsafeExecutableJs);

      return {
        success: true,
        state: {
          frames: visualizer.getFrames(),
          entities: Object.fromEntries(
            visualizer.getEntities().map((entity) => [
              entity.getDescriptor().id,
              entity.getDescriptor(),
            ]),
          ),
        },
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      return {
        success: false,
        reason: (e instanceof VisualizerReevaluateError)
          ? e.reason
          : String(e),
      };
    }
  }
}

mountWindowChildIPC<IsolatedWorkerRunnerEvents>(
  (listener) => self.addEventListener("message", listener),
  (message) => self.postMessage(message),
  new WorkerRunnerChildIPC(),
);
