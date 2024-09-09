import { defaultReferenceTokens } from "~/themes/defaultReferenceTokens";
import { createTheme } from "~/themes/createTheme";
import { defaultSystemTokensFactory } from "~/themes/defaultSystemTokensFactory";
import { rem } from "~/utilities/theme/rem";

export const lightTheme = createTheme({
  id: "blueprint-light",
  name: (tokens) => tokens.theme.name.light,
  editor: (tokens) => ({
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": tokens.dynamic.surface.color.editor,
    },
  }),
  tokens: {
    reference: defaultReferenceTokens,
    system: defaultSystemTokensFactory,
    dynamic: (tokens) => ({
      layout: {
        color: {
          spinner: tokens.reference.color.primary.P30,
        },
      },
      notifications: {
        color: {
          text: tokens.reference.color.neutral.P100,
          icon: {
            success: tokens.reference.color.success.P60,
            danger: tokens.reference.color.error.P60,
          },
        },
      },
      panel: {
        color: {
          text: tokens.reference.color.neutral.P20,
        },
      },
      markdown: {
        color: {
          inlineCode: tokens.reference.color.neutral.P90,
          heading: tokens.reference.color.neutral.P30,
        },
      },
      input: {
        color: {
          text: tokens.reference.color.neutral.P50,
          icon: tokens.reference.color.neutral.P50,
          default: tokens.reference.color.neutral.P50,
          error: tokens.reference.color.error.P50,
          success: tokens.reference.color.success.P50,
          focused: tokens.reference.color.primary.P50,
        },
      },
      auth: {
        color: {
          label: tokens.reference.color.neutral.P40,
          text: tokens.reference.color.neutral.P40,
          separator: tokens.reference.color.neutral.P80,
        },
      },
      button: {
        color: {
          border: tokens.reference.color.neutral.P85,
          shadow: {
            surface: {
              primary: tokens.reference.color.neutral.P100,
              secondary: tokens.reference.color.neutral.P60,
            },
            text: tokens.reference.color.neutral.P85,
          },
          text: {
            regular: tokens.reference.color.neutral.P40,
            hover: tokens.reference.color.neutral.P30,
            active: tokens.reference.color.neutral.P25,
          },
        },
      },
      surface: {
        color: {
          panel: tokens.reference.color.neutral.P90,
          background: tokens.reference.color.neutral.P70,
          editor: tokens.reference.color.neutral.P95,
          loader: tokens.reference.color.neutral.P95,
          snippet: {
            source: tokens.reference.color.primary.P70,
            visualizer: tokens.reference.color.secondary.P70,
            markdown: tokens.reference.color.neutral.P70,
          },
          shadow: {
            primary: tokens.reference.color.neutral.P80,
            secondary: tokens.reference.color.neutral.P50,
            text: tokens.reference.color.neutral.P85,
          },
        },
        accentColor: {
          snippet: {
            source: tokens.reference.color.primary.P60,
            visualizer: tokens.reference.color.secondary.P60,
            markdown: tokens.reference.color.neutral.P60,
          },
        },
      },
      editor: {
        color: {
          markdownText: tokens.reference.color.neutral.P30,
          highlight: tokens.reference.color.primary.P70,
        },
      },
      program: {
        color: {
          progressTrack: tokens.reference.color.neutral.P75,
          progress: tokens.reference.color.primary.P70,
        },
      },
      logo: {
        color: {
          primary: tokens.reference.color.primary.P40,
          accent: tokens.reference.color.primary.P40,
        },
      },
      visualizer: {
        border: {
          link: `${rem(2)} solid ${tokens.reference.color.neutral.P80}`,
        },
        color: {
          snippetTitle: tokens.reference.color.neutral.P30,
          snippetDescription: tokens.reference.color.neutral.P35,
          door: {
            primary: tokens.reference.color.neutral.P80,
            accent: tokens.reference.color.neutral.P85,
          },
          hiddenIcon: tokens.reference.color.neutral.P70,
          visualizerEntryTitle: tokens.reference.color.neutral.P20,
          entities: {
            scalar: {
              undefined: tokens.reference.color.neutral.P50,
              object: tokens.reference.color.warning.P50,
              number: tokens.reference.color.info.P50,
              string: tokens.reference.color.success.P50,
              symbol: tokens.reference.color.primary.P50,
              function: tokens.reference.color.primary.P50,
              boolean: tokens.reference.color.secondary.P50,
            },
            list: {
              index: tokens.reference.color.neutral.P40,
              border: tokens.reference.color.neutral.P40,
              emptyList: tokens.reference.color.neutral.P60,
            },
          },
        },
      },
      global: {
        color: {
          inlineCode: tokens.reference.color.neutral.P95,
        },
      },
    }),
  },
});
