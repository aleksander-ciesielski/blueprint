import type * as t from "@babel/types";

export interface RunnerBuildContext {
  unsafeJsAstWithVisualizerUpdates: t.Program;
}
