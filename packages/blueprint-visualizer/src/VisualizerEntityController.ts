import type { AnyVisualizerEntity } from "~/VisualizerEntity";
import type { Visualizer } from "~/Visualizer";

export class VisualizerEntityController<TEntity extends AnyVisualizerEntity> {
  public constructor(
    private readonly entity: TEntity,
    private readonly visualizer: Visualizer,
  ) {}

  public hide(): void {
    this.visualizer.hide(this.entity);
  }

  public show(): void {
    this.visualizer.show(this.entity);
  }
}
