import styled from "styled-components";
import { Snippet } from "~/components/app/Snippet/Snippet";
import { SnippetEditor } from "~/components/app/Snippet/SnippetEditor";

export const LeftSnippet = styled(Snippet)`
  margin-left: 0;
  margin-right: auto;
`;

export const Editor = styled(SnippetEditor)`
  width: 100%;
`;
