import * as React from "react";
import type { Monaco } from "@monaco-editor/react";

// eslint-disable-next-line import/no-webpack-loader-syntax, max-len
const visualizerLibDefinition = await import("!!raw-loader!@blueprint/visualizer/dist/api.d.ts").then((lib) => lib.default);

export function useExtraLibsRegister() {
  return React.useCallback((monaco: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "@blueprint/visualizer" { ${visualizerLibDefinition} }`,
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      "declare const visualizer: import(\"@blueprint/visualizer\").VisualizerAPI;",
    );
  }, []);
}
