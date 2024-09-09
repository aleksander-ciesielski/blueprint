import Editor, { useMonaco } from "@monaco-editor/react";
import * as React from "react";
import { match } from "ts-pattern";
import type { BeforeMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { UIEvent } from "react";
import * as S from "~/components/app/Snippet/SnippetEditor.styles";
import { EventBus } from "~/entities/EventBus";
import { useDispatch, useSelector } from "~/store/store";
import { useEventBus } from "~/hooks/useEventBus";
import { visualizerSnippetEmbedded } from "~/store/snippetSlice";
import { onEditorDecorationClick } from "~/hooks/editor/onEditorDecorationClick";
import { programCodeUpdated } from "~/store/programSlice";
import { useTheme } from "~/hooks/theme/useTheme";

const EDITOR_MIN_HEIGHT_PX = 24;
const EDITOR_LINE_NUMBERS_EXTRA_CHARS = 5;

const ADD_VISUALIZER_SNIPPET_GLYPH_MARGIN_CLASS_NAME = "add-visualizer-button";
const LINE_HIGHLIGHT_CLASS_NAME = "line-highlight";
const LINE_HIGHLIGHT_ANIMATION_NAME = "line-highlight-blink";

export interface SnippetEditorHighlight {
  start: number;
  end: number;
}

export interface SnippetEditorProps {
  value: string;
  lineNumbers?: editor.LineNumbersType;
  groupId: string;
  snippetId: string;
  language: string;
  allowEmbeddingVisualizerSnippet: boolean;
  beforeMount?: BeforeMount;
  highlights?: SnippetEditorHighlight[];
  readOnly: boolean;
  className?: string;
  onChange?(current: string | undefined): void;
}

enum SelectSnippetEditorPosition {
  Start = "START",
  End = "END",
}

interface SelectSnippetEditorEventPayload {
  groupId: string;
  snippetId: string;
  columnNumber: number;
  position: SelectSnippetEditorPosition;
}

const selectSnippetEvent = new EventBus<SelectSnippetEditorEventPayload>();

interface SuggestController extends editor.IEditorContribution {
  model: {
    state: number;
  };
}

function isAutoCompleteOpen(editor: editor.IStandaloneCodeEditor) {
  const suggestController = editor.getContribution<SuggestController>("editor.contrib.suggestController");
  return (suggestController?.model.state === 2);
}

export function SnippetEditor(props: SnippetEditorProps) {
  const monaco = useMonaco();
  const theme = useTheme();
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();
  const dispatch = useDispatch();
  const allowEmbeddingVisualizerSnippet = props.allowEmbeddingVisualizerSnippet;
  const groupId = props.groupId;
  const snippetId = props.snippetId;
  const lineNumbers = props.lineNumbers;
  const highlights = props.highlights;
  const readOnly = props.readOnly;

  const updateHeight = React.useCallback(() => {
    if (editor === undefined) {
      return;
    }

    const height = Math.max(EDITOR_MIN_HEIGHT_PX, editor.getContentHeight());
    const width = editor.getDomNode()?.getBoundingClientRect()?.width ?? 0;

    editor.layout({ width, height });
  }, [editor, props.value]);

  const restartDecorationAnimations = React.useCallback(() => {
    Array.from(document.getElementsByClassName(LINE_HIGHLIGHT_CLASS_NAME)).forEach(
      (el) => {
        const animations = el.getAnimations() as CSSAnimation[];
        const lineHighlightAnimation = animations.find(
          (animation) => (animation.animationName === LINE_HIGHLIGHT_ANIMATION_NAME),
        );

        if (lineHighlightAnimation === undefined) {
          return;
        }

        lineHighlightAnimation.cancel();
        lineHighlightAnimation.play();
      },
    );
  }, []);

  React.useEffect(() => {
    const node = editor?.getContainerDomNode();
    if (node === undefined || node === null) {
      return;
    }

    const observer = new MutationObserver(restartDecorationAnimations);

    observer.observe(node, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [editor, restartDecorationAnimations]);

  const [decorations, setRawDecorations] = React.useState<editor.IEditorDecorationsCollection>();
  const setDecorations = React.useCallback((newDecorations: editor.IModelDeltaDecoration[]) => {
    if (editor === undefined || monaco === null) {
      return;
    }

    const highlightDecorations: editor.IModelDeltaDecoration[] = highlights?.map((highlight) => {
      const startPosition = editor.getModel()!.getPositionAt(highlight.start);
      const endPosition = editor.getModel()!.getPositionAt(highlight.end);

      return {
        range: new monaco.Range(
          startPosition.lineNumber,
          startPosition.column,
          endPosition.lineNumber,
          endPosition.column,
        ),
        options: {
          isWholeLine: false,
          className: LINE_HIGHLIGHT_CLASS_NAME,
        },
      };
    }) ?? [];

    const mergedDecorations: editor.IModelDeltaDecoration[] = [
      ...newDecorations,
      ...highlightDecorations,
    ];

    if (decorations === undefined) {
      setRawDecorations(editor.createDecorationsCollection(mergedDecorations));
      return;
    }

    decorations.set(mergedDecorations);
    restartDecorationAnimations();
  }, [editor, monaco, highlights, restartDecorationAnimations]);

  const updateVisualizerSnippetCreationButtons = React.useCallback(() => {
    if (editor === undefined || monaco === null) {
      return;
    }

    if (!allowEmbeddingVisualizerSnippet || readOnly) {
      setDecorations([]);
      return;
    }

    const lineCount = editor.getModel()?.getLineCount() ?? 1;
    setDecorations(
      Array.from({ length: lineCount })
        .map((_, idx) => (idx + 1))
        .map((lineNumber) => ({
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: ADD_VISUALIZER_SNIPPET_GLYPH_MARGIN_CLASS_NAME,
          },
        })),
    );
  }, [monaco, editor, setDecorations, allowEmbeddingVisualizerSnippet, readOnly]);

  const updateLineNumbersMinChars = React.useCallback(() => {
    if (lineNumbers === "off") {
      editor?.updateOptions({
        lineNumbersMinChars: 50,
      });

      return;
    }

    const lineCount = editor?.getModel()?.getLineCount() ?? 1;
    editor?.updateOptions({
      lineNumbersMinChars: Math.floor(Math.log10(lineCount)) + 1 + EDITOR_LINE_NUMBERS_EXTRA_CHARS,
    });
  }, [editor, lineNumbers]);

  const onChange = React.useCallback((current: string | undefined) => {
    updateLineNumbersMinChars();
    updateHeight();
    updateVisualizerSnippetCreationButtons();
    props.onChange?.(current);
  }, [updateHeight, updateVisualizerSnippetCreationButtons, props.onChange]);

  React.useEffect(() => {
    onChange(editor?.getModel()?.getValue());
  }, [onChange, monaco, editor]);

  useEventBus(selectSnippetEvent, (payload) => {
    const position = editor?.getPosition() ?? undefined;

    if (
      payload.groupId !== groupId
      || payload.snippetId !== snippetId
      || editor === undefined
      || position === undefined
    ) {
      return;
    }

    const newLineNumber = match(payload.position)
      .with(SelectSnippetEditorPosition.Start, () => 1)
      .with(SelectSnippetEditorPosition.End, () => editor.getModel()?.getLineCount() ?? 1)
      .exhaustive();

    editor.focus();
    editor.setPosition(position.with(newLineNumber, payload.columnNumber));
  }, [snippetId, groupId, editor]);

  const previousSnippetId = useSelector((state) => {
    const flatSnippets = state.snippet.snippetGroups
      .flatMap((snippetGroup) => snippetGroup.children);

    const idx = flatSnippets.findIndex((snippet) => (snippet.id === props.snippetId));

    if (idx === -1) {
      return undefined;
    }

    return flatSnippets[idx - 1]?.id;
  });

  const nextSnippetId = useSelector((state) => {
    const flatSnippets = state.snippet.snippetGroups
      .flatMap((snippetGroup) => snippetGroup.children);

    const idx = flatSnippets.findIndex((snippet) => (snippet.id === props.snippetId));

    if (idx === -1) {
      return undefined;
    }

    return flatSnippets[idx + 1]?.id;
  });

  React.useEffect(() => {
    if (editor === undefined) {
      return;
    }

    const { dispose } = editor.onKeyDown((event) => {
      if (event.code !== "ArrowUp" && event.code !== "ArrowDown") {
        return;
      }

      if (!editor.hasTextFocus() || isAutoCompleteOpen(editor)) {
        return;
      }

      const lineCount = editor.getModel()?.getLineCount();
      const lineNumber = editor.getPosition()?.lineNumber;
      const columnNumber = editor.getPosition()?.column ?? 1;

      if (event.code === "ArrowDown" && lineNumber === lineCount && nextSnippetId !== undefined) {
        selectSnippetEvent.emit({
          groupId,
          snippetId: nextSnippetId,
          columnNumber,
          position: SelectSnippetEditorPosition.Start,
        });

        event.stopPropagation();
        return;
      }

      if (event.code === "ArrowUp" && lineNumber === 1 && previousSnippetId !== undefined) {
        selectSnippetEvent.emit({
          groupId,
          snippetId: previousSnippetId,
          columnNumber,
          position: SelectSnippetEditorPosition.End,
        });

        event.stopPropagation();
      }
    });

    return () => dispose();
  }, [editor, nextSnippetId, previousSnippetId]);

  const onWheel = React.useCallback((evt: UIEvent) => {
    evt.stopPropagation();
  }, []);

  const embedVisualizerSnippet = React.useCallback((lineNumber: number) => {
    if (!allowEmbeddingVisualizerSnippet || readOnly) {
      return;
    }

    const lines = editor?.getModel()?.getLinesContent();
    if (lines === undefined) {
      return;
    }

    dispatch(visualizerSnippetEmbedded({
      groupId,
      snippetId,
      lineNumber,
    }));

    dispatch(programCodeUpdated());
  }, [allowEmbeddingVisualizerSnippet, readOnly, editor, groupId, snippetId]);

  onEditorDecorationClick(editor, (target) => {
    embedVisualizerSnippet(target.position.lineNumber);
  }, [embedVisualizerSnippet]);

  React.useLayoutEffect(() => {
    updateHeight();
  }, [editor]);

  React.useEffect(() => {
    if (editor === undefined) {
      return;
    }

    editor.updateOptions({ readOnly });
  }, [editor, readOnly]);

  return (
    <S.Container
      $addVisualizerGlyphMarginClassName={ADD_VISUALIZER_SNIPPET_GLYPH_MARGIN_CLASS_NAME}
      $lineHighlightClassName={LINE_HIGHLIGHT_CLASS_NAME}
      $lineHighlightAnimationName={LINE_HIGHLIGHT_ANIMATION_NAME}
      onWheelCapture={onWheel}
      className={props.className}
    >
      <Editor
        value={props.value}
        language={props.language}
        beforeMount={props.beforeMount}
        onMount={setEditor}
        onChange={onChange}
        theme={theme.id}
        options={{
          lineNumbers,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          wrappingStrategy: "advanced",
          overviewRulerLanes: 0,
          minimap: {
            enabled: false,
          },
          overflowWidgetsDomNode: document.body,
          fixedOverflowWidgets: true,
        }}
      />
    </S.Container>
  );
}
