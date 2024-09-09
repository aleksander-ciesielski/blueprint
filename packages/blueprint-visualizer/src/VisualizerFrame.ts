import type { VisualizerEntityVisibility } from "~/Visualizer";

export interface VisualizerFrameEntityContext<TEntityContext> {
  value: TEntityContext;
  visibility: VisualizerEntityVisibility;
}

export interface VisualizerFrame {
  context: Record<string, VisualizerFrameEntityContext<unknown>>;
  snippetGroupId: string;
  snippetId: string;
  start: number;
  end: number;
}
