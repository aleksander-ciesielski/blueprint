import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { RunnerBuildFailure } from "~/types/vm/RunnerBuildFailure";

export type IsolatedWorkerRunnerEvents = {
  setup(libs: Map<string, string>): void;
  build(snippetGroups: SnippetGroup[]): RunnerBuildOutput | RunnerBuildFailure;
};
