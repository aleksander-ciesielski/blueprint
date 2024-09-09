import type { Snippet } from "~/entities/snippet/Snippet";
import { useSnippetGroup } from "~/hooks/snippets/useSnippetGroup";

export function useSnippet(groupId: string, snippetId: string): Snippet | undefined {
  const group = useSnippetGroup(groupId);
  return group?.children.find((snippet) => (snippet.id === snippetId));
}
