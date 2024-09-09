export enum SnippetType {
  Source = "SOURCE",
  Visualizer = "VISUALIZER",
  Markdown = "MARKDOWN",
}

export interface Snippet {
  id: string;
  aliasIds: string[];
  aliasCharacterOffset: Record<string, number>;
  code: string;
  offset: number;
  type: SnippetType;
}
