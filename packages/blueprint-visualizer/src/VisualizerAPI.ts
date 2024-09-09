import type { Primitive } from "type-fest";
import type { VisualizerListEntity, VisualizerListEntityOptions } from "~/entities/VisualizerListEntity";
import type { VisualizerEntityController } from "~/VisualizerEntityController";
import type { VisualizerScalarEntity, VisualizerScalarEntityOptions } from "~/entities/VisualizerScalarEntity";

export interface VisualizerAPI {
  scalar<T extends NonNullable<Primitive>>(
    options: VisualizerScalarEntityOptions<T>,
  ): VisualizerEntityController<VisualizerScalarEntity<T>>;
  list<T extends NonNullable<unknown>>(
    options: VisualizerListEntityOptions<T>,
  ): VisualizerEntityController<VisualizerListEntity<T>>;
}
