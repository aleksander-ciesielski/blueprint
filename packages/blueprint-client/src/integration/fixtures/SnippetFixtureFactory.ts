import { nanoid } from "nanoid/non-secure";
import type { Snippet } from "~/entities/snippet/Snippet";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import { SnippetType } from "~/entities/snippet/Snippet";

export class SnippetFixtureFactory {
  public source(id: string, code: string): Snippet {
    return this.snippetOf(id, SnippetType.Source, code);
  }

  public visualizer(id: string, code: string): Snippet {
    return this.snippetOf(id, SnippetType.Visualizer, code);
  }

  public markdown(id: string, code: string): Snippet {
    return this.snippetOf(id, SnippetType.Markdown, code);
  }

  public group(children: Snippet[]): SnippetGroup {
    return {
      id: nanoid(),
      children,
    };
  }

  private snippetOf(id: string, type: SnippetType, code: string): Snippet {
    return {
      id,
      aliasIds: [],
      aliasCharacterOffset: {},
      code,
      offset: 0,
      type,
    };
  }
}
