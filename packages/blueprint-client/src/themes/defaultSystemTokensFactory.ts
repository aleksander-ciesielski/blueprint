import type { ThemeSystemTokensFactory } from "~/themes/tokens/system/ThemeSystemTokensFactory";
import { rem } from "~/utilities/theme/rem";

const TYPOGRAPHY_DISPLAY_FONT_FAMILY = "Inter, Helvetica, Arial, sans-serif";
const TYPOGRAPHY_BODY_FONT_FAMILY = "Roboto, Inter, Arial, sans-serif";
const TYPOGRAPHY_MONOSPACE_FONT_FAMILY = "'Roboto Mono', Consolas, Courier New";
const TYPOGRAPHY_LOGO_FONT_FAMILY = "'Chakra Petch', Inter, Verdana, Helvetica, Arial, serif";

export const defaultSystemTokensFactory: ThemeSystemTokensFactory = () => ({
  layout: {
    size: {
      spinner: rem(24),
    },
    height: {
      footer: rem(200),
    },
  },
  markdown: {
    radius: {
      inlineCode: rem(5),
    },
  },
  button: {
    icon: {
      size: {
        xsmall: rem(16),
        small: rem(20),
        medium: rem(20),
        large: rem(24),
        xlarge: rem(28),
        xxlarge: rem(32),
      },
    },
    columnGap: {
      xsmall: rem(6),
      small: rem(8),
      medium: rem(12),
      large: rem(14),
      xlarge: rem(16),
      xxlarge: rem(20),
    },
    minWidth: {
      xsmall: rem(48),
      small: rem(64),
      medium: rem(128),
      large: rem(164),
      xlarge: rem(190),
      xxlarge: rem(200),
    },
    spacing: {
      xsmall: rem(16),
      small: rem(18),
      medium: rem(24),
      large: rem(32),
      xlarge: rem(36),
      xxlarge: rem(42),
    },
    height: {
      xsmall: rem(36),
      small: rem(40),
      medium: rem(48),
      large: rem(64),
      xlarge: rem(72),
      xxlarge: rem(80),
    },
    shadow: {
      surface: {
        primary: {
          regular: `${rem(-3)} ${rem(-3)} ${rem(10)}`,
          hover: `${rem(-5)} ${rem(-5)} ${rem(10)}`,
        },
        secondary: {
          regular: `${rem(3)} ${rem(3)} ${rem(10)}`,
          hover: `${rem(5)} ${rem(5)} ${rem(10)}`,
        },
      },
      text: {
        xsmall: `${rem(2)} ${rem(2)} ${rem(3)}`,
        small: `${rem(2)} ${rem(2)} ${rem(3)}`,
        medium: `${rem(2)} ${rem(2)} ${rem(3)}`,
        large: `${rem(2)} ${rem(2)} ${rem(3)}`,
        xlarge: `${rem(2)} ${rem(2)} ${rem(3)}`,
        xxlarge: `${rem(2)} ${rem(2)} ${rem(3)}`,
      },
    },
  },
  common: {
    typography: {
      display: {
        xsmall: `normal 600 ${rem(10)} ${TYPOGRAPHY_DISPLAY_FONT_FAMILY}`,
        small: `normal 600 ${rem(12)} ${TYPOGRAPHY_DISPLAY_FONT_FAMILY}`,
        medium: `normal 600 ${rem(14)} ${TYPOGRAPHY_DISPLAY_FONT_FAMILY}`,
        large: `normal 600 ${rem(18)} ${TYPOGRAPHY_DISPLAY_FONT_FAMILY}`,
        xlarge: `normal 600 ${rem(20)} ${TYPOGRAPHY_DISPLAY_FONT_FAMILY}`,
        xxlarge: `normal 600 ${rem(24)} ${TYPOGRAPHY_DISPLAY_FONT_FAMILY}`,
      },
      body: {
        xsmall: `normal 400 ${rem(10)} ${TYPOGRAPHY_BODY_FONT_FAMILY}`,
        small: `normal 400 ${rem(12)} ${TYPOGRAPHY_BODY_FONT_FAMILY}`,
        medium: `normal 400 ${rem(14)} ${TYPOGRAPHY_BODY_FONT_FAMILY}`,
        large: `normal 400 ${rem(18)} ${TYPOGRAPHY_BODY_FONT_FAMILY}`,
        xlarge: `normal 400 ${rem(20)} ${TYPOGRAPHY_BODY_FONT_FAMILY}`,
        xxlarge: `normal 400 ${rem(24)} ${TYPOGRAPHY_BODY_FONT_FAMILY}`,
      },
      monospace: {
        regular: {
          xsmall: `normal 400 ${rem(10)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          small: `normal 400 ${rem(12)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          medium: `normal 400 ${rem(14)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          large: `normal 400 ${rem(18)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          xlarge: `normal 400 ${rem(20)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          xxlarge: `normal 400 ${rem(24)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
        },
        bold: {
          xsmall: `normal 600 ${rem(10)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          small: `normal 600 ${rem(12)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          medium: `normal 600 ${rem(14)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          large: `normal 600 ${rem(18)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          xlarge: `normal 600 ${rem(20)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
          xxlarge: `normal 600 ${rem(32)} ${TYPOGRAPHY_MONOSPACE_FONT_FAMILY}`,
        },
      },
      logo: {
        primary: `normal 300 ${rem(36)} ${TYPOGRAPHY_LOGO_FONT_FAMILY}`,
        accent: `normal 700 ${rem(36)} ${TYPOGRAPHY_LOGO_FONT_FAMILY}`,
      },
    },
    transition: {
      opacity: "opacity 100ms linear",
      color: {
        surface: "background-color 100ms linear",
        shadow: "box-shadow 100ms linear",
        text: "color 100ms linear",
        textShadow: "text-shadow 100ms linear",
      },
    },
    spacing: {
      surface: {
        xsmall: rem(6),
        small: rem(8),
        medium: rem(16),
        large: rem(24),
        xlarge: rem(32),
        xxlarge: rem(40),
      },
      panel: {
        xsmall: rem(3),
        small: rem(4),
        medium: rem(8),
        large: rem(12),
        xlarge: rem(16),
        xxlarge: rem(20),
      },
    },
    softRadius: rem(10),
    radius: {
      xsmall: rem(16),
      small: rem(32),
      medium: rem(32),
      large: rem(32),
      xlarge: rem(32),
      xxlarge: rem(32),
    },
  },
  editor: {
    container: {
      width: {
        default: rem(1024),
      },
    },
    highlight: {
      spacing: {
        xsmall: rem(0),
        small: rem(2),
        medium: rem(6),
        large: rem(10),
        xlarge: rem(10),
        xxlarge: rem(10),
      },
      radius: rem(2),
      opacity: {
        blinkA: "0.25",
        blinkB: "0.4",
      },
      blinkAnimationDuration: "0.5s",
    },
  },
  program: {
    transition: {
      progressPosition: "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
    },
    extraHeight: "60vh",
  },
  visualizer: {
    count: 4,
    width: {
      panel: rem(800),
    },
    size: {
      snippetIcon: rem(22),
      visualizerEntryIcon: rem(28),
      hiddenIcon: rem(42),
    },
    transition: {
      door: "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
    },
  },
  layer: {
    notifications: "200",
    programControls: "100",
    editor: "10",
  },
  main: {
    padding: {
      bottom: rem(200),
    },
  },
  global: {
    radius: {
      inlineCode: rem(5),
    },
  },
});
