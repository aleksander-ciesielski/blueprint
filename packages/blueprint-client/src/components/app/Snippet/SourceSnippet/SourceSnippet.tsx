import * as React from "react";
import { RiToolsFill, RiVideoAddFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { useMonaco } from "@monaco-editor/react";
import type ts from "typescript";
import type { Snippet } from "~/entities/snippet/Snippet";
import { useSnippet } from "~/hooks/snippets/useSnippet";
import { useSnippetValue } from "~/hooks/snippets/useSnippetValue";
import { useExtraLibsRegister } from "~/hooks/useExtraLibsRegister";
import { SnippetType } from "~/entities/snippet/Snippet";
import { useDispatch, useSelector } from "~/store/store";
import { snippetAdded, snippetRemoved } from "~/store/snippetSlice";
import * as S from "~/components/app/Snippet/SourceSnippet/SourceSnippet.styles";
import { useTranslation } from "~/hooks/translation/useTranslation";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { Button } from "~/components/ui/Button/Button";
import { useSnippetHighlights } from "~/hooks/snippets/useSnippetHighlights";
import { contentUpdated, programCodeUpdated } from "~/store/programSlice";

export interface SourceSnippetProps {
  groupId: string;
  snippetId: string;
  readOnly: boolean;
  showControls: boolean;
  overrideSnippet?: Snippet;
}

function getFullMessageText(chain: ts.DiagnosticMessageChain): string {
  let message = chain.messageText;
  if (chain.next !== undefined) {
    chain.next.forEach((next) => {
      message += `\n${getFullMessageText(next)}`;
    });
  }

  return message;
}

export function SourceSnippet(props: SourceSnippetProps) {
  const groupId = props.groupId;
  const snippetId = props.snippetId;
  const overrideValue = props.overrideSnippet;
  const monaco = useMonaco();
  const storedSnippet = useSnippet(groupId, snippetId);
  const snippet = (overrideValue === undefined)
    ? storedSnippet
    : overrideValue;

  const lineNumberOffset = (snippet?.offset ?? 0);
  const registerExtraLibs = useExtraLibsRegister();
  const [storedValue, setValue] = useSnippetValue(props.groupId, props.snippetId);
  const value = (overrideValue === undefined)
    ? storedValue
    : overrideValue.code;

  const translation = useTranslation();
  const dispatch = useDispatch();
  const isBuilt = useSelector((state) => (state.program.output !== undefined));
  const frame = useSelector((state) => state.program.output?.state.frames[state.program.currentFrameIdx]);

  const highlights = useSnippetHighlights(
    frame,
    value,
    snippetId,
    overrideValue?.aliasIds ?? storedSnippet?.aliasIds ?? [],
    overrideValue?.aliasCharacterOffset ?? storedSnippet?.aliasCharacterOffset ?? {},
    groupId,
    isBuilt,
  );

  const addVisualizerSnippet = React.useCallback(() => {
    dispatch(snippetAdded({
      groupId,
      previousSnippetId: snippetId,
      type: SnippetType.Visualizer,
    }));
    dispatch(contentUpdated());
    dispatch(programCodeUpdated());
  }, [groupId, snippetId]);

  const removeSnippet = React.useCallback(() => {
    dispatch(snippetRemoved({ groupId, snippetId }));
    dispatch(contentUpdated());
    dispatch(programCodeUpdated());
  }, [groupId, snippetId]);

  const handleValueChange = React.useCallback((current: string | undefined) => {
    if (value === current) {
      return;
    }

    setValue(current);

    if (monaco === null) {
      return;
    }

    const models = monaco.editor.getModels();
    models.forEach((model) => {
      if (model.getLanguageId() !== "typescript") {
        return;
      }

      monaco.languages.typescript.getTypeScriptWorker().then((worker) => {
        worker(model.uri).then((client) => {
          client.getSemanticDiagnostics(model.uri.toString()).then((diagnostics) => {
            const markers = diagnostics.map((diagnostic) => {
              const { start, length } = diagnostic;

              const startPos = model.getPositionAt(start ?? 0);
              const endPos = model.getPositionAt((start ?? 0) + (length ?? 0));

              return {
                startLineNumber: startPos.lineNumber,
                startColumn: startPos.column,
                endLineNumber: endPos.lineNumber,
                endColumn: endPos.column,
                message: typeof diagnostic.messageText === "string"
                  ? diagnostic.messageText
                  : getFullMessageText(diagnostic.messageText),
                severity: monaco.MarkerSeverity.Error,
              };
            });

            monaco.editor.setModelMarkers(model, "typescript", markers);
          });
        });
      });
    });
  }, [value, monaco]);

  return (
    <S.LeftSnippet
      type={SnippetType.Source}
      title={translation.of((tokens) => tokens.program.snippet.sourceSnippetTitle)}
      description={translation.of((tokens) => tokens.program.snippet.sourceSnippetDescription)}
      icon={RiToolsFill}
      showControls={props.showControls}
      editor={
        <S.Editor
          value={value}
          language={"typescript"}
          onChange={(current) => handleValueChange(current)}
          groupId={groupId}
          snippetId={snippetId}
          lineNumbers={(x) => String(x + lineNumberOffset)}
          allowEmbeddingVisualizerSnippet={true}
          beforeMount={registerExtraLibs}
          highlights={isBuilt ? highlights : []}
          readOnly={props.readOnly}
        />
      }
      controls={(
        <>
          <Button
            size={SystemTokenSize.ExtraSmall}
            onPress={addVisualizerSnippet}
            icon={RiVideoAddFill}
            iconLabel={translation.textOf((tokens) => tokens.program.snippet.addVisualizationSnippet)}
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
