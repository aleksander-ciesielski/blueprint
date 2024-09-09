/* eslint-disable max-len */

import type { Translation } from "~/translation/Translation";
import type * as React from "react";
import { InlineCode, UserName } from "~/components/GlobalComponents";

export const enUK: Translation = {
  id: "en-UK",
  tags: ["en-UK", "en"],
  name: (tokens) => tokens.language.name.englishUK,
  tokens: {
    page: {
      title: {
        index: () => "Home",
        error: () => "Error",
        login: () => "Log In",
        register: () => "Register",
        editor: () => "Editor",
        editProgram: (programName) => `Edit "${programName}"`,
        viewProgram: (programName) => programName,
      },
    },
    language: {
      name: {
        englishUK: () => "English (UK)",
        polish: () => "Polish",
      },
    },
    theme: {
      name: {
        light: () => "Light",
        dark: () => "Dark",
      },
    },
    program: {
      newProgram: () => "Add a program",
      view: () => "View",
      edit: () => "Edit",
      build: () => "Build",
      save: () => "Save",
      successfullyForked: () => "The program was forked.",
      successfullySaved: () => "Changes were saved.",
      fork: () => "Fork",
      error: {
        tooManyVisualizerEntities: () => "Too many visualizer entities registered.",
        trackedEntityValueChangedInHiddenSnippet: () => "Tracked entity value changed in a hidden snippet.",
        trackedEntityVisibilityChangedInVisibleSnippet: () => "Tracked entity visibility changed in a visible snippet.",
        entityTrackingEnabledInVisibleSnippet: () => "Entity started being tracked in a visible snippet",
        unhandled: (raw) => `Unhandled error: ${raw}`,
      },
      snippet: {
        addSourceSnippet: () => "Add Source Snippet",
        addVisualizationSnippet: () => "Add Visualisation Snippet",
        addMarkdownSnippet: () => "Add Markdown Snippet",
        removeSnippet: () => "Remove Snippet",
        sourceSnippetTitle: () => "Source",
        visualizationSnippetTitle: () => "Visualisation",
        markdownSnippetTitle: () => "Markdown",
        sourceSnippetDescription: () => "Source snippets are visible in the program page and contain the main logic behind your program.",
        visualizationSnippetDescription: (visualizerIdentifier) => (
          <>
            Visualisation snippets are hidden from the program page and contain the code controlling the visualisations using <InlineCode>{visualizerIdentifier}</InlineCode> object.
          </>
        ),
        markdownSnippetDescription: () => "Markdown snippets are visible in the program page as a rendered text. They can contain LaTeX expressions.",
      },
      visualizer: {
        types: {
          scalar: () => "Scalar",
          list: () => "List",
        },
        list: {
          emptyList: () => "(empty list)",
        },
      },
      enableAutoplay: () => "Enable autoplay",
      disableAutoplay: () => "Disable autoplay",
      progressPercentage: (progressPercentage) => `${progressPercentage.toLocaleString("en-UK")}%`,
      progressPercentageLabel: (progressPercentage) => `${progressPercentage.toLocaleString("en-UK")}%`,
    },
    auth: {
      welcomeUser: (userName) => (
        <>
          Hi <UserName>{userName}</UserName>!
        </>
      ),
      welcomeGuest: () => "Hi there! You're not logged in.",
      logoutAction: () => "Log Out",
      loginAction: () => "Log In",
    },
  },
};
