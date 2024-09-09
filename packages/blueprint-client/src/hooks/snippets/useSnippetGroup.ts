import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import { useSelector } from "~/store/store";

export function useSnippetGroup(groupId: string): SnippetGroup | undefined {
  return useSelector((state) => (
    state.snippet.snippetGroups
      .find((el) => (el.id === groupId))
  ));
}
