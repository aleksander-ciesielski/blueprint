import { useMonaco } from "@monaco-editor/react";
import * as React from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";

function isDecorationPressed(
  monaco: Monaco,
  event: editor.IEditorMouseEvent,
): event is typeof event & { target: editor.IMouseTargetMargin } {
  return (
    event.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
    || event.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS
  );
}

export function onEditorDecorationClick(
  editor: editor.IStandaloneCodeEditor | undefined,
  callback: (target: editor.IMouseTargetMargin) => void,
  dependencies: unknown[],
): void {
  const [pressedDown, setPressedDown] = React.useState(false);
  const memoizedCallback = React.useCallback(callback, dependencies);
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco === null || editor === undefined) {
      return;
    }

    const onMouseDown = editor.onMouseDown(
      (event) => setPressedDown(isDecorationPressed(monaco, event)),
    );

    const onMouseUp = editor.onMouseUp((event) => {
      if (!pressedDown || !isDecorationPressed(monaco, event)) {
        return;
      }

      memoizedCallback(event.target);
    });

    return () => {
      onMouseDown.dispose();
      onMouseUp.dispose();
    };
  }, [monaco, editor, memoizedCallback, pressedDown]);
}
