import type { Primitive } from "type-fest";
import type { VisualizerEntityDescriptor } from "~/VisualizerEntityDescriptor";
import type { VisualizerEntity, VisualizerEntityOptions } from "~/VisualizerEntity";
import { VisualizerEntityType } from "~/VisualizerEntityType";

export interface VisualizerScalarEntityDescriptor extends VisualizerEntityDescriptor<VisualizerEntityType.Scalar> {}

export interface VisualizerScalarEntityOptions<T> extends VisualizerEntityOptions<T> {}

export class VisualizerScalarEntity<T extends NonNullable<Primitive>> implements VisualizerEntity<T, VisualizerScalarEntityDescriptor> {
  public constructor(
    private readonly id: string,
    private readonly options: VisualizerScalarEntityOptions<T>,
  ) {}

  public getDescriptor(): VisualizerScalarEntityDescriptor {
    return {
      type: VisualizerEntityType.Scalar,
      name: this.options.name,
      id: this.id,
    };
  }

  public get(): T {
    return this.options.get();
  }

  public compare(previous: T, current: T): boolean {
    return (previous === current);
  }
}
