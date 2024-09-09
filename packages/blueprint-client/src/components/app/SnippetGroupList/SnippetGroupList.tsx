import * as React from "react";
import { RiToolsFill } from "react-icons/ri";
import { IoText } from "react-icons/io5";
import { nanoid } from "nanoid/non-secure";
import { match } from "ts-pattern";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import { SnippetGroupListEntry } from "~/components/app/SnippetGroupList/SnippetGroupListEntry/SnippetGroupListEntry";
import * as S from "~/components/app/SnippetGroupList/SnippetGroupList.styles";
import { Button } from "~/components/ui/Button/Button";
import { SnippetType } from "~/entities/snippet/Snippet";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { useDispatch } from "~/store/store";
import { useTranslation } from "~/hooks/translation/useTranslation";
import { snippetGroupAdded } from "~/store/snippetSlice";
import { programCodeUpdated } from "~/store/programSlice";

export interface SnippetGroupListProps {
  snippetGroups: SnippetGroup[];
  readOnly: boolean;
  showControls: boolean;
  showVisualizerSnippets: boolean;
  gap: SystemTokenSize;
}

function affectsBuildOutput(snippetType: SnippetType): boolean {
  return match(snippetType)
    .with(SnippetType.Source, () => true)
    .with(SnippetType.Visualizer, () => true)
    .with(SnippetType.Markdown, () => false)
    .exhaustive();
}

export function SnippetGroupList(props: SnippetGroupListProps) {
  const dispatch = useDispatch();
  const translation = useTranslation();

  const addSnippet = React.useCallback((type: SnippetType) => {
    dispatch(snippetGroupAdded({
      snippets: [{
        id: nanoid(),
        aliasIds: [],
        aliasCharacterOffset: {},
        code: "",
        offset: 0,
        type,
      }],
    }));

    if (affectsBuildOutput(type)) {
      dispatch(programCodeUpdated());
    }
  }, []);

  return (
    <S.Container>
      <S.SnippetGroups $gap={props.gap}>
        {
          props.snippetGroups.map((snippetGroup) => (
            <SnippetGroupListEntry
              key={snippetGroup.id}
              snippetGroup={snippetGroup}
              readOnly={props.readOnly}
              showControls={props.showControls}
              showVisualizerSnippets={props.showVisualizerSnippets}
            />
          ))
        }
      </S.SnippetGroups>
      {props.showControls && (
        <S.Controls>
          <Button
            onPress={() => addSnippet(SnippetType.Source)}
            size={SystemTokenSize.Small}
            icon={RiToolsFill}
          >
            {translation.of((tokens) => tokens.program.snippet.addSourceSnippet)}
          </Button>
          <Button
            onPress={() => addSnippet(SnippetType.Markdown)}
            size={SystemTokenSize.Small}
            icon={IoText}
          >
            {translation.of((tokens) => tokens.program.snippet.addMarkdownSnippet)}
          </Button>
        </S.Controls>
      )}
    </S.Container>
  );
}
