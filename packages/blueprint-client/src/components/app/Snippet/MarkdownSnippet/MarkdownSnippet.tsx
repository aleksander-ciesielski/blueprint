import * as React from "react";
import { CgClose } from "react-icons/cg";
import { IoText } from "react-icons/io5";
import * as S from "~/components/app/Snippet/MarkdownSnippet/MarkdownSnippet.styles";
import { useSnippetValue } from "~/hooks/snippets/useSnippetValue";
import { useDebounce } from "~/hooks/useDebounce";
import { SnippetType } from "~/entities/snippet/Snippet";
import { Button } from "~/components/ui/Button/Button";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { snippetRemoved } from "~/store/snippetSlice";
import { useDispatch } from "~/store/store";
import { useTranslation } from "~/hooks/translation/useTranslation";

const PREVIEW_DELAY_MS = 500;

export interface MarkdownSnippetProps {
  groupId: string;
  snippetId: string;
  readOnly: boolean;
  showControls: boolean;
}

export function MarkdownSnippet(props: MarkdownSnippetProps) {
  const groupId = props.groupId;
  const snippetId = props.snippetId;

  const [value, setValue] = useSnippetValue(props.groupId, props.snippetId);
  const debouncedValue = useDebounce(value, PREVIEW_DELAY_MS);
  const dispatch = useDispatch();
  const translation = useTranslation();

  const removeSnippet = React.useCallback(() => {
    dispatch(snippetRemoved({ groupId, snippetId }));
  }, [groupId, snippetId]);

  return (
    <S.FullWidthSnippet
      type={SnippetType.Markdown}
      title={translation.of((tokens) => tokens.program.snippet.markdownSnippetTitle)}
      description={translation.of((tokens) => tokens.program.snippet.markdownSnippetDescription)}
      icon={IoText}
      showControls={props.showControls}
      editor={
        <S.EditorContainer>
          {props.showControls && (
            <S.Editor
              value={value}
              language={"markdown"}
              onChange={(current) => setValue(current)}
              groupId={groupId}
              snippetId={snippetId}
              lineNumbers={"off"}
              allowEmbeddingVisualizerSnippet={false}
              readOnly={props.readOnly}
            />
          )}
          <S.Preview
            markdown={debouncedValue}
            $spacing={
              (props.showControls)
                ? SystemTokenSize.Medium
                : SystemTokenSize.Large
            }
          />
        </S.EditorContainer>
      }
      controls={(
        <>
          <Button
            size={SystemTokenSize.ExtraSmall}
            onPress={removeSnippet}
            icon={CgClose}
            iconLabel={translation.textOf((tokens) => tokens.program.snippet.removeSnippet)}
          />
        </>
      )}
    />
  );
}
