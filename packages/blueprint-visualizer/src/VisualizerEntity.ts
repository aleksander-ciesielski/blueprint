import type { VisualizerEntityDescriptor } from "~/VisualizerEntityDescriptor";
import type { VisualizerEntityType } from "~/VisualizerEntityType";

export interface VisualizerEntityOptions<T> {
  name: string;
  get(): T;
}

export interface VisualizerEntity<T extends NonNullable<unknown>, TDescriptor extends VisualizerEntityDescriptor<VisualizerEntityType>> {
  getDescriptor(): TDescriptor;
  get(): T;
  compare(previous: T, current: T): boolean;
}

export type AnyVisualizerEntity = VisualizerEntity<NonNullable<unknown>, VisualizerEntityDescriptor<VisualizerEntityType>>;
