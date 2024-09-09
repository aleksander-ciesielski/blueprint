import type { Satisfies, DeepRecord } from "@blueprint/common";
import type { TextToken } from "~/translation/TextToken";
import type * as React from "react";

export type TextTokenDefinitions = Satisfies<DeepRecord<keyof any, TextToken<any[]>>, {
  page: {
    title: {
      index(): React.ReactNode;
      error(): React.ReactNode;
      login(): React.ReactNode;
      register(): React.ReactNode;
      editor(): React.ReactNode;
      editProgram(programName: string): React.ReactNode;
      viewProgram(programName: string): React.ReactNode;
    };
  };
  language: {
    name: {
      englishUK(): React.ReactNode;
      polish(): React.ReactNode;
    };
  };
  theme: {
    name: {
      light(): React.ReactNode;
      dark(): React.ReactNode;
    };
  };
  program: {
    newProgram(): React.ReactNode;
    view(): React.ReactNode;
    edit(): React.ReactNode;
    build(): React.ReactNode;
    save(): React.ReactNode;
    successfullyForked(): React.ReactNode;
    successfullySaved(): React.ReactNode;
    fork(): React.ReactNode;
    error: {
      tooManyVisualizerEntities(): React.ReactNode;
      trackedEntityValueChangedInHiddenSnippet(): React.ReactNode;
      trackedEntityVisibilityChangedInVisibleSnippet(): React.ReactNode;
      entityTrackingEnabledInVisibleSnippet(): React.ReactNode;
      unhandled(raw: string): React.ReactNode;
    };
    snippet: {
      addSourceSnippet(): React.ReactNode;
      addVisualizationSnippet(): React.ReactNode;
      addMarkdownSnippet(): React.ReactNode;
      removeSnippet(): React.ReactNode;
      sourceSnippetTitle(): React.ReactNode;
      visualizationSnippetTitle(): React.ReactNode;
      markdownSnippetTitle(): React.ReactNode;
      sourceSnippetDescription(): React.ReactNode;
      visualizationSnippetDescription(visualizerIdentifier: string): React.ReactNode;
      markdownSnippetDescription(): React.ReactNode;
    };
    visualizer: {
      types: {
        scalar(): React.ReactNode;
        list(): React.ReactNode;
      };
      list: {
        emptyList(): React.ReactNode;
      };
    };
    enableAutoplay(): React.ReactNode;
    disableAutoplay(): React.ReactNode;
    progressPercentage(progressPercentage: number): React.ReactNode;
    progressPercentageLabel(progressPercentage: number): React.ReactNode;
  };
  auth: {
    welcomeUser(userName: string): React.ReactNode;
    welcomeGuest(): React.ReactNode;
    logoutAction(): React.ReactNode;
    loginAction(): React.ReactNode;
  },
}>;
