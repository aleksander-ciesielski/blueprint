/* eslint-disable max-len */

import * as React from "react";
import { RiToolsFill, RiVideoAddFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { useSnippet } from "~/hooks/snippets/useSnippet";
import { useSnippetValue } from "~/hooks/snippets/useSnippetValue";
import { useExtraLibsRegister } from "~/hooks/useExtraLibsRegister";
import { SnippetType } from "~/entities/snippet/Snippet";
import { snippetRemoved, snippetAdded } from "~/store/snippetSlice";
import { useDispatch, useSelector } from "~/store/store";
import * as S from "~/components/app/Snippet/VisualizationSnippet/VisualizationSnippet.styles";
import { useTranslation } from "~/hooks/translation/useTranslation";
import { Button } from "~/components/ui/Button/Button";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { useSnippetHighlights } from "~/hooks/snippets/useSnippetHighlights";
import { programCodeUpdated } from "~/store/programSlice";

export interface VisualizerSnippetProps {
  groupId: string;
  snippetId: string;
  readOnly: boolean;
  showControls: boolean;
}

const VISUALIZER_GLOBAL_IDENTIFIER = "visualizer";

export function VisualizationSnippet(props: VisualizerSnippetProps) {
  const groupId = props.groupId;
  const snippetId = props.snippetId;
  const snippet = useSnippet(groupId, snippetId);
  const lineNumberOffset = (snippet?.offset ?? 0);
  const [value, setValue] = useSnippetValue(props.groupId, props.snippetId);
  const registerExtraLibs = useExtraLibsRegister();
  const translation = useTranslation();
  const dispatch = useDispatch();
  const isBuilt = useSelector((state) => (state.program.output !== undefined));
  const frame = useSelector((state) => state.program.output?.state.frames[state.program.currentFrameIdx]);

  const highlights = useSnippetHighlights(
    frame,
    value,
    snippetId,
    [],
    {},
    groupId,
    isBuilt,
  );

  const addSourceSnippet = React.useCallback(() => {
    dispatch(snippetAdded({
      groupId,
      previousSnippetId: snippetId,
      type: SnippetType.Source,
    }));
    dispatch(programCodeUpdated());
  }, [groupId, snippetId]);

  const removeSnippet = React.useCallback(() => {
    dispatch(snippetRemoved({ groupId, snippetId }));
    dispatch(programCodeUpdated());
  }, [groupId, snippetId]);

  return (
    <S.RightSnippet
      type={SnippetType.Visualizer}
      title={translation.of((tokens) => tokens.program.snippet.visualizationSnippetTitle)}
      description={translation.of((tokens) => tokens.program.snippet.visualizationSnippetDescription, VISUALIZER_GLOBAL_IDENTIFIER)}
      icon={RiVideoAddFill}
      showControls={props.showControls}
      editor={
        <S.Editor
          language={"typescript"}
          value={value}
          onChange={(current) => setValue(current)}
          groupId={groupId}
          snippetId={snippetId}
          lineNumbers={(line) => String(line + lineNumberOffset)}
          allowEmbeddingVisualizerSnippet={false}
          beforeMount={registerExtraLibs}
          highlights={isBuilt ? highlights : []}
          readOnly={props.readOnly}
        />
      }
      controls={(
        <>
          <Button
            size={SystemTokenSize.ExtraSmall}
            onPress={addSourceSnippet}
            icon={RiToolsFill}
            iconLabel={translation.textOf((tokens) => tokens.program.snippet.addSourceSnippet)}
          />
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
