/* eslint-disable max-len */

import type { Translation } from "~/translation/Translation";
import type * as React from "react";
import { InlineCode, UserName } from "~/components/GlobalComponents";

export const plPL: Translation = {
  id: "pl-PL",
  tags: ["pl-PL", "pl"],
  name: (tokens) => tokens.language.name.polish,
  tokens: {
    page: {
      title: {
        index: () => "Strona główna",
        error: () => "Błąd",
        login: () => "Logowanie",
        register: () => "Rejestracja",
        editor: () => "Edytor",
        editProgram: (programName) => `Edytuj "${programName}"`,
        viewProgram: (programName) => programName,
      },
    },
    language: {
      name: {
        englishUK: () => "Angielski (Wielka Brytania)",
        polish: () => "Polski",
      },
    },
    theme: {
      name: {
        light: () => "Jasny",
        dark: () => "Ciemny",
      },
    },
    program: {
      newProgram: () => "Dodaj program",
      view: () => "Wyświetl",
      edit: () => "Edytuj",
      build: () => "Wykonaj",
      save: () => "Zapisz",
      successfullyForked: () => "Program został sklonowany.",
      successfullySaved: () => "Zmiany zostały zapisane.",
      fork: () => "Sklonuj",
      error: {
        tooManyVisualizerEntities: () => "Zarejestrowano zbyt dużą liczbę wizualizacji.",
        trackedEntityValueChangedInHiddenSnippet: () => "Wartość śledzonego obiektu zmieniła się w ukrytym kodzie.",
        trackedEntityVisibilityChangedInVisibleSnippet: () => "Widzialność śledzonego obiektu zmieniła się w widocznym kodzie.",
        entityTrackingEnabledInVisibleSnippet: () => "Obiekt zaczął być śledzony podczas wykonywania widocznego kodu.",
        unhandled: (raw) => `Nieobsłużony błąd: ${raw}`,
      },
      snippet: {
        addSourceSnippet: () => "Dodaj kod źródłowy",
        addVisualizationSnippet: () => "Dodaj kod wizualizacyjny",
        addMarkdownSnippet: () => "Dodaj kod Markdown",
        removeSnippet: () => "Usuń kod",
        sourceSnippetTitle: () => "Kod źródłowy",
        visualizationSnippetTitle: () => "Kod wizualizacyjny",
        markdownSnippetTitle: () => "Kod Markdown",
        sourceSnippetDescription: () => "Kod źródłowy jest widoczny na stronie programu i zawiera główną logikę algorytmu.",
        visualizationSnippetDescription: (visualizerIdentifier) => (
          <>
            Kod wizualizacyjny jest ukryty na stronie programu i kontroluje wizualizacje za pomocą obiektu <InlineCode>{visualizerIdentifier}</InlineCode>.
          </>
        ),
        markdownSnippetDescription: () => "Kod Markdown jest widoczny na stronie programu jako sformatowany tekst. Posiada wsparcie wyrażeń LaTeX.",
      },
      visualizer: {
        types: {
          scalar: () => "Wartość prymitywna",
          list: () => "Lista",
        },
        list: {
          emptyList: () => "(pusta lista)",
        },
      },
      enableAutoplay: () => "Włącz autoodtwarzanie",
      disableAutoplay: () => "Wyłącz autoodtwarzanie",
      progressPercentage: (progressPercentage) => `${progressPercentage.toLocaleString("pl-PL")}%`,
      progressPercentageLabel: (progressPercentage) => `${progressPercentage.toLocaleString("pl-PL")}%`,
    },
    auth: {
      welcomeUser: (userName) => (
        <>
          Witaj, <UserName>{userName}</UserName>!
        </>
      ),
      welcomeGuest: () => "Witaj! Aktualnie nie jesteś zalogowany.",
      logoutAction: () => "Wyloguj",
      loginAction: () => "Zaloguj się",
    },
  },
};
