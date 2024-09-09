import * as React from "react";
import { match } from "ts-pattern";
import { useSnippet } from "~/hooks/snippets/useSnippet";
import { useDispatch } from "~/store/store";
import { snippetCodeUpdated } from "~/store/snippetSlice";
import { contentUpdated, programCodeUpdated } from "~/store/programSlice";
import { SnippetType } from "~/entities/snippet/Snippet";

function affectsBuildOutput(snippetType: SnippetType): boolean {
  return match(snippetType)
    .with(SnippetType.Source, () => true)
    .with(SnippetType.Visualizer, () => true)
    .with(SnippetType.Markdown, () => false)
    .exhaustive();
}

export function useSnippetValue(
  groupId: string,
  snippetId: string,
): [value: string, setValue: (code: string | undefined) => void] {
  const dispatch = useDispatch();

  const snippet = useSnippet(groupId, snippetId);
  const value = snippet?.code ?? "";
  const snippetType = snippet?.type;

  const setValue = React.useCallback((code: string | undefined) => {
    if (code === undefined || code === value || snippetType === undefined) {
      return;
    }

    dispatch(snippetCodeUpdated({
      groupId,
      snippetId,
      code,
    }));

    dispatch(contentUpdated());

    if (affectsBuildOutput(snippetType)) {
      dispatch(programCodeUpdated());
    }
  }, [groupId, snippetId, value, snippetType]);

  return [value, setValue];
}
