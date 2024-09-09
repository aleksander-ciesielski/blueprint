import type { Primitive } from "type-fest";
import type { VisualizerListEntityOptions } from "~/entities/VisualizerListEntity";
import type { AnyVisualizerEntity, VisualizerEntityOptions } from "~/VisualizerEntity";
import type { VisualizerAPI } from "~/VisualizerAPI";
import type { VisualizerScalarEntityOptions } from "~/entities/VisualizerScalarEntity";
import type { VisualizerState } from "~/VisualizerState";
import type { VisualizerFrame, VisualizerFrameEntityContext } from "~/VisualizerFrame";
import { VisualizerScalarEntity } from "~/entities/VisualizerScalarEntity";
import { VisualizerEntityController } from "~/VisualizerEntityController";
import { VisualizerListEntity } from "~/entities/VisualizerListEntity";
import { VisualizerReevaluateError, VisualizerReevaluateErrorReason } from "~/errors/VisualizerReevaluateError";

export enum VisualizerEntityVisibility {
  Hidden = "HIDDEN",
  Visible = "VISIBLE",
}

export interface VisualizerEntityStateUpdate {
  entity: AnyVisualizerEntity;
  previous: VisualizerFrameEntityContext<NonNullable<unknown>> | undefined;
  next: VisualizerFrameEntityContext<NonNullable<unknown>>;
}

export class Visualizer implements VisualizerAPI {
  public static readonly MAX_VISUALIZER_ENTITIES = 4;

  private static readonly VISUALIZER_ENTITY_DEFAULT_VISIBILITY = VisualizerEntityVisibility.Visible;

  private readonly previousState = new Map<AnyVisualizerEntity, VisualizerFrameEntityContext<NonNullable<unknown>>>();
  private readonly state = new Map<AnyVisualizerEntity, VisualizerFrameEntityContext<NonNullable<unknown>>>();
  private readonly frames: VisualizerFrame[] = [];

  public constructor(
    private readonly assignEntityId: (entityOptions: VisualizerEntityOptions<unknown>) => string,
  ) {}

  public list<T>(options: VisualizerListEntityOptions<T>): VisualizerEntityController<VisualizerListEntity<T>> {
    return this.registerEntity(
      new VisualizerListEntity(this.assignEntityId(options), options),
    );
  }

  public scalar<T extends NonNullable<Primitive>>(
    options: VisualizerScalarEntityOptions<T>,
  ): VisualizerEntityController<VisualizerScalarEntity<T>> {
    return this.registerEntity(
      new VisualizerScalarEntity(this.assignEntityId(options), options),
    );
  }

  public hide(entity: AnyVisualizerEntity): void {
    this.setVisibility(entity, VisualizerEntityVisibility.Hidden);
  }

  public show(entity: AnyVisualizerEntity): void {
    this.setVisibility(entity, VisualizerEntityVisibility.Visible);
  }

  public reevaluate(
    snippetGroupId: string,
    snippetId: string,
    isSnippetVisible: boolean,
    start: number,
    end: number,
  ): void {
    if (this.state.size > Visualizer.MAX_VISUALIZER_ENTITIES) {
      throw new VisualizerReevaluateError(
        VisualizerReevaluateErrorReason.TooManyVisualizerEntities,
      );
    }

    const updates = this.getEntityStateUpdates();

    const newEntities = new Set(
      updates.filter((update) => (update.previous === undefined)),
    );

    const entitiesWithValueChange = new Set(
      updates
        .filter((update) => (
          update.previous !== undefined
          && !update.entity.compare(update.previous.value, update.next.value)
        ))
        .map((update) => update.entity),
    );

    const entitiesWithVisibilityChange = new Set(
      updates.filter((update) => (
        (update.previous?.visibility ?? Visualizer.VISUALIZER_ENTITY_DEFAULT_VISIBILITY) !== update.next.visibility
      ))
        .map((update) => update.entity),
    );

    this.previousState.clear();

    updates.forEach((update) => {
      this.state.set(update.entity, update.next);
    });

    this.state.forEach((state, descriptorId) => {
      this.previousState.set(descriptorId, state);
    });

    if (newEntities.size > 0 && isSnippetVisible) {
      throw new VisualizerReevaluateError(
        VisualizerReevaluateErrorReason.EntityTrackingEnabledInVisibleSnippet,
      );
    }

    if (entitiesWithVisibilityChange.size > 0 && isSnippetVisible) {
      throw new VisualizerReevaluateError(
        VisualizerReevaluateErrorReason.TrackedEntityVisibilityChangedInVisibleSnippet,
      );
    }

    if (entitiesWithValueChange.size > 0 && !isSnippetVisible) {
      throw new VisualizerReevaluateError(
        VisualizerReevaluateErrorReason.TrackedEntityValueChangedInHiddenSnippet,
      );
    }

    const didSomeVisibleEntityChangeValue = Array.from(entitiesWithValueChange)
      .some((entity) => {
        const visibility = this.state.get(entity)?.visibility ?? Visualizer.VISUALIZER_ENTITY_DEFAULT_VISIBILITY;
        return (visibility === VisualizerEntityVisibility.Visible);
      });

    if (
      !didSomeVisibleEntityChangeValue
      && entitiesWithVisibilityChange.size === 0
      && newEntities.size === 0
    ) {
      return;
    }

    this.frames.push({
      context: Object.fromEntries(
        Array.from(updates).map((update) => [
          update.entity.getDescriptor().id,
          update.next,
        ]),
      ),
      snippetGroupId,
      snippetId,
      start,
      end,
    });
  }

  public getState(): VisualizerState {
    return {
      frames: this.getFrames(),
      entities: Object.fromEntries(
        this.getEntities().map((entity) => [
          entity.getDescriptor().id,
          entity.getDescriptor(),
        ]),
      ),
    };
  }

  public getFrames(): VisualizerFrame[] {
    return this.frames.slice();
  }

  public getEntities(): AnyVisualizerEntity[] {
    return Array.from(this.state.keys());
  }

  private registerEntity<TEntity extends AnyVisualizerEntity>(
    entity: TEntity,
  ): VisualizerEntityController<TEntity> {
    this.state.set(entity, {
      value: entity.get(),
      visibility: Visualizer.VISUALIZER_ENTITY_DEFAULT_VISIBILITY,
    });

    return new VisualizerEntityController(entity, this);
  }

  private getEntityStateUpdates(): VisualizerEntityStateUpdate[] {
    return Array.from(this.state)
      .map(([entity]) => ({
        entity,
        previous: (this.previousState.has(entity))
          ? {
            value: this.previousState.get(entity)!.value,
            visibility: this.previousState.get(entity)?.visibility ?? Visualizer.VISUALIZER_ENTITY_DEFAULT_VISIBILITY,
          }
          : undefined,
        next: {
          value: entity.get(),
          visibility: this.state.get(entity)?.visibility ?? Visualizer.VISUALIZER_ENTITY_DEFAULT_VISIBILITY,
        },
      })) satisfies Partial<VisualizerEntityStateUpdate>[];
  }

  private setVisibility(entity: AnyVisualizerEntity, visibility: VisualizerEntityVisibility): void {
    this.previousState.set(entity, {
      value: this.state.get(entity)!.value,
      visibility: this.previousState.get(entity)!.visibility,
    });

    this.state.set(entity, {
      value: entity.get(),
      visibility,
    });
  }
}
