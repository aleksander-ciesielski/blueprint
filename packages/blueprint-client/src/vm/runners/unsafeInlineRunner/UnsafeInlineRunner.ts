import { Visualizer } from "@blueprint/visualizer";
import type { Runner } from "~/types/vm/Runner";
import type { AlgorithmCodeTransformer } from "~/services/vm/AlgorithmCodeTransformer";
import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";

/**
 * DO NOT USE WITH USER INPUT
 */
export class UnsafeInlineRunner implements Runner {
  public constructor(
    private readonly algorithmCodeTransformer: AlgorithmCodeTransformer,
  ) {}

  public async build(snippetGroups: SnippetGroup[]): Promise<RunnerBuildOutput> {
    const visualizer = new Visualizer((options) => options.name);

    const ctx = this.algorithmCodeTransformer.transformToBuildContext(snippetGroups);
    const code = this.algorithmCodeTransformer.transformToExecutableJs(
      ctx.unsafeJsAstWithVisualizerUpdates,
      "visualizer",
    );

    // eslint-disable-next-line no-eval -- this code is meant to be run without involving any user input.
    await eval(code);

    return {
      success: true,
      state: visualizer.getState(),
    };
  }
}
