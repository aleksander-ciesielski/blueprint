import type { VisualizerReevaluateErrorReason } from "@blueprint/visualizer";

export interface RunnerBuildFailure {
  success: false;
  reason: string | VisualizerReevaluateErrorReason;
}
