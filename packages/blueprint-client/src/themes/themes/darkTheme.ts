import { defaultReferenceTokens } from "~/themes/defaultReferenceTokens";
import { createTheme } from "~/themes/createTheme";
import { defaultSystemTokensFactory } from "~/themes/defaultSystemTokensFactory";
import { rem } from "~/utilities/theme/rem";

export const darkTheme = createTheme({
  id: "blueprint-dark",
  name: (tokens) => tokens.theme.name.dark,
  editor: (tokens) => ({
    base: "vs-dark",
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
          spinner: tokens.reference.color.primary.P80,
        },
      },
      auth: {
        color: {
          label: tokens.reference.color.neutral.P60,
          text: tokens.reference.color.neutral.P60,
          separator: tokens.reference.color.neutral.P30,
        },
      },
      panel: {
        color: {
          text: tokens.reference.color.neutral.P80,
        },
      },
      notifications: {
        color: {
          text: tokens.reference.color.neutral.P90,
          icon: {
            success: tokens.reference.color.success.P40,
            danger: tokens.reference.color.error.P40,
          },
        },
      },
      markdown: {
        color: {
          inlineCode: tokens.reference.color.neutral.P20,
          heading: tokens.reference.color.neutral.P70,
        },
      },
      input: {
        color: {
          text: tokens.reference.color.neutral.P65,
          icon: tokens.reference.color.neutral.P65,
          default: tokens.reference.color.neutral.P65,
          error: tokens.reference.color.error.P65,
          success: tokens.reference.color.success.P65,
          focused: tokens.reference.color.primary.P65,
        },
      },
      button: {
        color: {
          border: tokens.reference.color.neutral.P25,
          shadow: {
            surface: {
              primary: tokens.reference.color.neutral.P25,
              secondary: tokens.reference.color.neutral.P0,
            },
            text: tokens.reference.color.neutral.P10,
          },
          text: {
            regular: tokens.reference.color.neutral.P70,
            hover: tokens.reference.color.neutral.P75,
            active: tokens.reference.color.neutral.P80,
          },
        },
      },
      surface: {
        color: {
          panel: tokens.reference.color.neutral.P20,
          background: tokens.reference.color.neutral.P10,
          editor: tokens.reference.color.neutral.P15,
          loader: tokens.reference.color.neutral.P10,
          snippet: {
            source: tokens.reference.color.primary.P40,
            visualizer: tokens.reference.color.secondary.P40,
            markdown: tokens.reference.color.neutral.P40,
          },
          shadow: {
            primary: tokens.reference.color.neutral.P15,
            secondary: tokens.reference.color.neutral.P0,
            text: tokens.reference.color.neutral.P10,
          },
        },
        accentColor: {
          snippet: {
            source: tokens.reference.color.primary.P50,
            visualizer: tokens.reference.color.secondary.P50,
            markdown: tokens.reference.color.neutral.P50,
          },
        },
      },
      editor: {
        color: {
          markdownText: tokens.reference.color.neutral.P70,
          highlight: tokens.reference.color.primary.P80,
        },
      },
      program: {
        color: {
          progressTrack: tokens.reference.color.neutral.P15,
          progress: tokens.reference.color.primary.P45,
        },
      },
      logo: {
        color: {
          primary: tokens.reference.color.primary.P80,
          accent: tokens.reference.color.primary.P80,
        },
      },
      visualizer: {
        border: {
          link: `${rem(2)} solid ${tokens.reference.color.neutral.P15}`,
        },
        color: {
          snippetTitle: tokens.reference.color.neutral.P70,
          snippetDescription: tokens.reference.color.neutral.P60,
          door: {
            primary: tokens.reference.color.neutral.P10,
            accent: tokens.reference.color.neutral.P15,
          },
          hiddenIcon: tokens.reference.color.neutral.P40,
          visualizerEntryTitle: tokens.reference.color.neutral.P70,
          entities: {
            scalar: {
              undefined: tokens.reference.color.neutral.P60,
              object: tokens.reference.color.warning.P60,
              number: tokens.reference.color.info.P60,
              string: tokens.reference.color.success.P60,
              symbol: tokens.reference.color.primary.P60,
              function: tokens.reference.color.primary.P60,
              boolean: tokens.reference.color.secondary.P60,
            },
            list: {
              index: tokens.reference.color.neutral.P60,
              border: tokens.reference.color.neutral.P40,
              emptyList: tokens.reference.color.neutral.P40,
            },
          },
        },
      },
      global: {
        color: {
          inlineCode: tokens.reference.color.neutral.P15,
        },
      },
    }),
  },
});
