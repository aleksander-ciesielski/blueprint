import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { RunnerBuildFailure } from "~/types/vm/RunnerBuildFailure";

export interface Runner {
  build(snippetGroups: SnippetGroup[]): Promise<RunnerBuildOutput | RunnerBuildFailure>;
}
