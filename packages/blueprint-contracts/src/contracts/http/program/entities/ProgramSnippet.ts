export enum ProgramSnippetType {
  Source = "SOURCE",
  Visualizer = "VISUALIZER",
  Markdown = "MARKDOWN",
}

export interface ProgramSnippet {
  codeBase64: string;
  type: ProgramSnippetType;
}
