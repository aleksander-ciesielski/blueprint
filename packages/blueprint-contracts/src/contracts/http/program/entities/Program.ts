import { ProgramSnippetGroup } from "~/contracts/http/program/entities/ProgramSnippetGroup";

export interface Program {
  name: string;
  authorId: string;
  authorName: string;
  snippetGroups: ProgramSnippetGroup[];
}
