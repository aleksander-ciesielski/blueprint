import type { VisualizerEntityDescriptor } from "~/VisualizerEntityDescriptor";
import type { VisualizerEntity, VisualizerEntityOptions } from "~/VisualizerEntity";
import { VisualizerEntityType } from "~/VisualizerEntityType";

export interface VisualizerListEntityDescriptor extends VisualizerEntityDescriptor<VisualizerEntityType.List> {}

export interface VisualizerListEntityOptions<T> extends VisualizerEntityOptions<T[]> {}

export class VisualizerListEntity<T> implements VisualizerEntity<T[], VisualizerListEntityDescriptor> {
  public constructor(
    private readonly id: string,
    private readonly options: VisualizerListEntityOptions<T>,
  ) {}

  public getDescriptor(): VisualizerListEntityDescriptor {
    return {
      type: VisualizerEntityType.List,
      name: this.options.name,
      id: this.id,
    };
  }

  public get(): T[] {
    return this.options.get().slice();
  }

  public compare(previous: T[], current: T[]): boolean {
    return (
      (previous.length === current.length)
      && previous.every((_, i) => (previous[i] === current[i]))
    );
  }
}
