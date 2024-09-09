import styled from "styled-components";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { rem } from "~/utilities/theme/rem";
import { MarkdownPreview } from "~/components/app/Snippet/MarkdownSnippet/MarkdownPreview/MarkdownPreview";
import { SnippetEditor } from "~/components/app/Snippet/SnippetEditor";
import { Snippet } from "~/components/app/Snippet/Snippet";

export const Container = styled.div`
  display: flex;
  row-gap: 10px;
  width: 100%;
`;

export const EditorContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: ${rem(10)};
`;

export const Editor = styled(SnippetEditor)`
  flex-grow: 1;
  flex-basis: 0;
`;

export const Preview = styled(MarkdownPreview)<{ $spacing: SystemTokenSize }>`
  flex-grow: 1;
  flex-basis: 0;
  background-color: ${({ theme }) => theme.tokens.dynamic.surface.color.editor};
  color: ${({ theme }) => theme.tokens.dynamic.editor.color.markdownText};
  padding: ${({ theme, $spacing }) => theme.tokens.system.common.spacing.panel[$spacing]};
`;

export const FullWidthSnippet = styled(Snippet)`
  width: 100%;
`;
