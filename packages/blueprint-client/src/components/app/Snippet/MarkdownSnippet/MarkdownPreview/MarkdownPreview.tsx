import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import * as S from "~/components/app/Snippet/MarkdownSnippet/MarkdownPreview/MarkdownPreview.styles";

export interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

export function MarkdownPreview(props: MarkdownPreviewProps) {
  return (
    <S.Container className={props.className}>
      <S.Markdown>
        <ReactMarkdown
          children={props.markdown}
          remarkPlugins={[remarkParse, remarkMath, remarkRehype]}
          rehypePlugins={[rehypeKatex, rehypeStringify]}
        />
      </S.Markdown>
    </S.Container>
  );
}
