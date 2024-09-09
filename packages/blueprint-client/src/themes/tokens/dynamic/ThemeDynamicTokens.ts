export interface ThemeDynamicTokens {
  layout: {
    color: {
      spinner: string;
    };
  };
  notifications: {
    color: {
      text: string;
      icon: {
        success: string;
        danger: string;
      };
    };
  };
  panel: {
    color: {
      text: string;
    };
  };
  auth: {
    color: {
      label: string;
      text: string;
      separator: string;
    };
  };
  markdown: {
    color: {
      inlineCode: string;
      heading: string;
    };
  };
  input: {
    color: {
      text: string;
      icon: string;
      default: string;
      error: string;
      success: string;
      focused: string;
    };
  };
  button: {
    color: {
      border: string;
      shadow: {
        surface: {
          primary: string;
          secondary: string;
        };
        text: string;
      };
      text: {
        regular: string;
        hover: string;
        active: string;
      };
    };
  };
  surface: {
    color: {
      panel: string;
      background: string;
      editor: string;
      loader: string;
      snippet: {
        source: string;
        visualizer: string;
        markdown: string;
      };
      shadow: {
        primary: string;
        secondary: string;
        text: string;
      };
    };
    accentColor: {
      snippet: {
        source: string;
        visualizer: string;
        markdown: string;
      };
    };
  };
  editor: {
    color: {
      markdownText: string;
      highlight: string;
    };
  };
  program: {
    color: {
      progressTrack: string;
      progress: string;
    };
  };
  logo: {
    color: {
      primary: string;
      accent: string;
    };
  };
  visualizer: {
    border: {
      link: string;
    };
    color: {
      snippetTitle: string;
      snippetDescription: string;
      door: {
        primary: string;
        accent: string;
      };
      hiddenIcon: string;
      visualizerEntryTitle: string;
      entities: {
        scalar: {
          undefined: string;
          object: string;
          number: string;
          string: string;
          symbol: string;
          function: string;
          boolean: string;
        };
        list: {
          index: string;
          border: string;
          emptyList: string;
        };
      };
    };
  };
  global: {
    color: {
      inlineCode: string;
    };
  };
}
