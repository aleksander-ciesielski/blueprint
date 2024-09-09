import type { Snippet } from "~/entities/snippet/Snippet";

export interface SnippetGroup {
  id: string;
  children: Snippet[];
}
