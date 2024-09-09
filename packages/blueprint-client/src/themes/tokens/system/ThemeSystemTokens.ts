import type { SystemSizeBasedTokens } from "~/themes/tokens/system/size/SystemSizeBasedTokens";

export interface ThemeSystemTokens {
  layout: {
    size: {
      spinner: string;
    };
    height: {
      footer: string;
    };
  };
  markdown: {
    radius: {
      inlineCode: string;
    };
  };
  button: {
    icon: {
      size: SystemSizeBasedTokens;
    };
    columnGap: SystemSizeBasedTokens;
    minWidth: SystemSizeBasedTokens;
    spacing: SystemSizeBasedTokens;
    height: SystemSizeBasedTokens;
    shadow: {
      surface: {
        primary: {
          regular: string;
          hover: string;
        }
        secondary: {
          regular: string;
          hover: string;
        };
      };
      text: SystemSizeBasedTokens;
    };
  };
  common: {
    typography: {
      display: SystemSizeBasedTokens;
      body: SystemSizeBasedTokens;
      monospace: {
        regular: SystemSizeBasedTokens;
        bold: SystemSizeBasedTokens;
      };
      logo: {
        primary: string;
        accent: string;
      };
    };
    transition: {
      opacity: string;
      color: {
        surface: string;
        shadow: string;
        text: string;
        textShadow: string;
      };
    };
    spacing: {
      surface: SystemSizeBasedTokens;
      panel: SystemSizeBasedTokens;
    };
    softRadius: string;
    radius: SystemSizeBasedTokens;
  };
  editor: {
    container: {
      width: {
        default: string;
      };
    };
    highlight: {
      spacing: SystemSizeBasedTokens;
      radius: string;
      opacity: {
        blinkA: string;
        blinkB: string;
      };
      blinkAnimationDuration: string;
    };
  };
  program: {
    transition: {
      progressPosition: string;
    };
    extraHeight: string;
  };
  visualizer: {
    count: number;
    width: {
      panel: string;
    };
    size: {
      snippetIcon: string;
      visualizerEntryIcon: string;
      hiddenIcon: string;
    };
    transition: {
      door: string;
    };
  };
  layer: {
    notifications: string;
    programControls: string;
    editor: string;
  };
  main: {
    padding: {
      bottom: string;
    };
  };
  global: {
    radius: {
      inlineCode: string;
    };
  };
}
