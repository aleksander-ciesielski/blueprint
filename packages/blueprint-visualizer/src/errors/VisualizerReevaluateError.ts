export enum VisualizerReevaluateErrorReason {
  TooManyVisualizerEntities = "TOO_MANY_VISUALIZER_ENTITIES",
  TrackedEntityValueChangedInHiddenSnippet = "TRACKED_ENTITY_VALUE_CHANGED_IN_HIDDEN_SNIPPET",
  TrackedEntityVisibilityChangedInVisibleSnippet = "TRACKED_ENTITY_VISIBILITY_CHANGED_IN_VISIBLE_SNIPPET",
  EntityTrackingEnabledInVisibleSnippet = "ENTITY_TRACKING_ENABLED_IN_VISIBLE_SNIPPET",
}

export class VisualizerReevaluateError extends Error {
  public constructor(public readonly reason: VisualizerReevaluateErrorReason) {
    super(reason);
  }
}
