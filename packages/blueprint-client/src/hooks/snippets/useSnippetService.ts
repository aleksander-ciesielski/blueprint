import { Lazy } from "@blueprint/common";
import { VisualizerValidator } from "@blueprint/visualizer";
import { SnippetService } from "~/services/snippets/SnippetService";
import { IsolatedWorkerRunner } from "~/vm/runners/isolatedWorkerRunner/IsolatedWorkerRunner";

export const snippetService = new SnippetService(
  new VisualizerValidator(),
  Lazy.of(IsolatedWorkerRunner.create),
);

export function useSnippetService(): SnippetService {
  return snippetService;
}
