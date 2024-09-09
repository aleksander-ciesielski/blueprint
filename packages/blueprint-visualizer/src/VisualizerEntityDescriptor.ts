import type { VisualizerEntityType } from "~/VisualizerEntityType";

export interface VisualizerEntityDescriptor<TEntityType extends VisualizerEntityType> {
  type: TEntityType;
  name: string;
  id: string;
}
