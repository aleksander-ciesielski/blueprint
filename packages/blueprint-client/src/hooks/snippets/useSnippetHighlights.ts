import * as React from "react";
import type { VisualizerFrame } from "@blueprint/visualizer";
import type { SnippetEditorHighlight } from "~/components/app/Snippet/SnippetEditor";

const HIGHLIGHT_TRIMMABLE_CHARACTER_PATTERN = /[\r\n ]/;

export function useSnippetHighlights(
  frame: VisualizerFrame | undefined,
  snippetValue: string,
  snippetId: string,
  aliasIds: string[],
  aliasCharacterOffset: Record<string, number>,
  groupId: string,
  visible: boolean,
): SnippetEditorHighlight[] {
  return React.useMemo<SnippetEditorHighlight[]>(() => {
    if (
      frame === undefined
      || frame.snippetGroupId !== groupId
      || !visible
    ) {
      return [];
    }

    if (
      frame.snippetId !== snippetId
      && !aliasIds.includes(frame.snippetId)
    ) {
      return [];
    }

    const characterOffset = aliasCharacterOffset[frame.snippetId] ?? 0;

    const start = frame.start + characterOffset;
    const end = frame.end + characterOffset;

    let startTrimmed = start;
    while (HIGHLIGHT_TRIMMABLE_CHARACTER_PATTERN.test(snippetValue[startTrimmed] ?? "")) {
      startTrimmed += 1;
    }

    return [{
      start: (startTrimmed >= end)
        ? start
        : startTrimmed,
      end,
    }];
  }, [frame, snippetValue, snippetId, groupId, visible]);
}
