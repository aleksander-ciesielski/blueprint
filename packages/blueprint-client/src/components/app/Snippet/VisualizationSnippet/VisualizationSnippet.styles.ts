import styled from "styled-components";
import { Snippet } from "~/components/app/Snippet/Snippet";
import { SnippetEditor } from "~/components/app/Snippet/SnippetEditor";

export const RightSnippet = styled(Snippet)`
  margin-left: auto;
  margin-right: 0;
`;

export const Editor = styled(SnippetEditor)`
  width: ${({ theme }) => theme.tokens.system.editor.container.width.default};
`;
