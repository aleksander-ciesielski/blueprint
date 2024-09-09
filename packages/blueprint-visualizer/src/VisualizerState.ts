import type { VisualizerFrame } from "~/VisualizerFrame";
import type { VisualizerEntityDescriptor } from "~/VisualizerEntityDescriptor";
import type { VisualizerEntityType } from "~/VisualizerEntityType";

export interface VisualizerState {
  frames: VisualizerFrame[];
  entities: Record<string, VisualizerEntityDescriptor<VisualizerEntityType>>;
}
