import type { AnyVisualizerEntity } from "~/VisualizerEntity";
import type { VisualizerEntityDescriptor } from "~/VisualizerEntityDescriptor";
import type { VisualizerEntityType } from "~/VisualizerEntityType";

export interface VisualizerEntityValue<T extends NonNullable<unknown>> {
  value: T;
  visible: boolean;
}

export class VisualizerEntityChanges {
  private readonly valueChanged: boolean;
  private readonly visibilityChanged: boolean;

  public constructor(
    private readonly currentEntityValues: WeakMap<AnyVisualizerEntity, VisualizerEntityValue<NonNullable<unknown>>>,
    private readonly hiddenEntityIds: Set<string>,
    private readonly entities: Set<AnyVisualizerEntity>,
  ) {
    const updatedValues = new Map(
      Array.from(this.entities).map((entity) => [
        entity,
        {
          value: entity.get(),
          visible: hiddenEntityIds.has(entity.getDescriptor().id),
        },
      ]),
    ) satisfies typeof this.currentEntityValues;

    this.valueChanged = Array.from(updatedValues).some(([entity, newValue]) => !entity.compare(
      this.currentEntityValues.get(entity)!.value,
      newValue.value,
    ));

    this.visibilityChanged = Array.from(updatedValues).some(([entity, newValue]) => (
      this.currentEntityValues.get(entity)!.visible !== newValue.visible
    ));
  }

  public hasChanged(): boolean {
    return (
      this.hasValueChanged()
      || this.hasVisibilityChanged()
    );
  }

  public hasValueChanged(): boolean {
    return this.valueChanged;
  }

  public hasVisibilityChanged(): boolean {
    return this.visibilityChanged;
  }

  private getComputedValue<T>(descriptor: VisualizerEntityDescriptor<VisualizerEntityType>, value: T): T | undefined {
    return (this.hiddenEntityIds.has(descriptor.id))
      ? undefined
      : value;
  }
}
